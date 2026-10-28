const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { readData, writeData } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be configured with at least 32 characters');
}

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// Serve Static Frontend Assets
app.use(express.static(path.join(__dirname, '../client/dist')));

// Helper to get or init single Harsh Barot Admin
function ensureAdmin() {
  let users = readData('users');
  if (users.length === 0) {
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;
    if (!initialPassword) return;
    if (initialPassword.length < 8) {
      throw new Error('ADMIN_INITIAL_PASSWORD must contain at least 8 characters');
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(initialPassword, salt);
    const defaultAdmin = {
      id: 'admin-1',
      username: 'harsh',
      fullName: 'હર્ષ બારોટ',
      phone: '9825000000',
      passwordHash: hash,
      role: 'admin',
      city: 'કલોલ, ગાંધીનગર',
      businessName: 'બારોટ મોબિલિટી (Barot Mobility)',
      createdAt: new Date().toISOString()
    };
    users = [defaultAdmin];
    writeData('users', users);
  } else if (!users.every(user => typeof user.passwordHash === 'string' && /^\$2[aby]\$\d{2}\$/.test(user.passwordHash))) {
    throw new Error('An existing administrator has an invalid password hash; reset it through a controlled migration before starting the server');
  }
}
ensureAdmin();

function normalizeUsername(value) {
  return String(value || '').trim().toLowerCase();
}

function validPassword(value) {
  return typeof value === 'string' && value.length >= 8;
}

const passwordResetRequests = new Map();
const mailTransport = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD
  ? nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
  })
  : null;

// Authentication Middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'પ્રવેશ નામંજૂર: કૃપા કરીને લોગીન કરો' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'સત્ર સમાપ્ત થઈ ગયું છે, ફરી લોગીન કરો' });
  }
}

// =================== AUTH APIS ===================

app.post('/api/auth/register', (req, res) => {
  const { username, fullName, phone, password, confirmPassword } = req.body;
  const users = readData('users');
  if (users.length > 0) {
    return res.status(409).json({ error: 'પ્રથમ એડમિન પહેલેથી જ નોંધાયેલ છે. નવું એકાઉન્ટ સર્વર એડમિન દ્વારા ઉમેરવું પડશે.' });
  }
  if (!username || !fullName || !validPassword(password) || password !== confirmPassword) {
    return res.status(400).json({ error: 'નામ, યુઝરનેમ અને સરખા ઓછામાં ઓછા ૮ અક્ષરના પાસવર્ડ જરૂરી છે' });
  }
  const normalizedUsername = normalizeUsername(username);
  if (users.some(user => normalizeUsername(user.username) === normalizedUsername)) {
    return res.status(409).json({ error: 'આ યુઝરનેમ પહેલેથી જ ઉપયોગમાં છે' });
  }

  users.push({
    id: `admin-${Date.now()}`,
    username: String(username).trim(),
    fullName: String(fullName).trim(),
    phone: String(phone || '').trim(),
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'admin',
    city: 'કલોલ, ગાંધીનગર',
    businessName: 'બારોટ મોબિલિટી (Barot Mobility)',
    createdAt: new Date().toISOString()
  });
  writeData('users', users);
  res.status(201).json({ message: 'રજીસ્ટ્રેશન સફળ થયું છે. હવે લોગીન કરો.' });
});

// Admin Login Only (Strict)
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'યુઝરનેમ અને પાસવર્ડ દાખલ કરો' });
  }

  const users = readData('users');
  const user = users.find(u => normalizeUsername(u.username) === normalizeUsername(username));

  if (!user) {
    return res.status(401).json({ error: 'અમાન્ય યુઝરનેમ અથવા પાસવર્ડ' });
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'અમાન્ય યુઝરનેમ અથવા પાસવર્ડ' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, fullName: user.fullName, role: user.role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  res.json({
    message: 'સફળતાપૂર્વક લોગીન થયા છો',
    token,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      city: user.city || 'કલોલ, ગાંધીનગર',
      businessName: user.businessName || 'બારોટ મોબિલિટી'
    }
  });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { username, securityAnswer, newPassword, confirmPassword } = req.body;
  const configuredQuestion = process.env.ADMIN_SECURITY_QUESTION || 'What is the name of your business?';
  const configuredAnswer = (process.env.ADMIN_SECURITY_ANSWER || '').trim().toLowerCase();

  if (!username || !securityAnswer || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'યુઝરનેમ, સુરક્ષા જવાબ અને નવો પાસવર્ડ જરૂરી છે' });
  }

  if (!configuredAnswer) {
    return res.status(503).json({
      error: 'સર્વરમાં ADMIN_SECURITY_ANSWER set નથી. પાસવર્ડ ફરીથી સેટ કરવા માટે ENV પર સુરક્ષા જવાબ ઉમેરો.'
    });
  }

  const users = readData('users');
  const user = users.find(item => normalizeUsername(item.username) === normalizeUsername(username));

  if (!user) {
    return res.status(404).json({ error: 'આ યુઝરનેમ માટે એકાઉન્ટ મળ્યું નથી' });
  }

  if (String(securityAnswer).trim().toLowerCase() !== configuredAnswer) {
    return res.status(401).json({ error: 'સુરક્ષા જવાબ ખોટો છે' });
  }

  if (!validPassword(newPassword) || newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'નવો પાસવર્ડ ઓછામાં ઓછા ૮ અક્ષરનો હોવો જોઈએ અને કન્ફર્મ સાથે સરખો હોવો જોઈએ' });
  }

  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  writeData('users', users);
  passwordResetRequests.delete(user.id);

  res.json({
    message: 'પાસવર્ડ સફળતાપૂર્વક બદલાઈ ગયો છે. હવે તમે નવા પાસવર્ડથી લોગીન કરી શકો છો.',
    securityQuestion: configuredQuestion
  });
});

app.post('/api/auth/forgot-password/verify', (req, res) => {
  return res.status(410).json({
    error: 'આ મેથડ હવે સપોર્ટ નથી. કૃપા કરીને સુરક્ષા જવાબ અને નવા પાસવર્ડ સાથે ફક્ત /api/auth/forgot-password વાપરો.'
  });
});

// Admin Profile: Get details
app.get('/api/auth/profile', authMiddleware, (req, res) => {
  const users = readData('users');
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'યુઝર મળ્યો નથી' });
  res.json({
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    phone: user.phone,
    role: user.role,
    city: user.city || 'કલોલ, ગાંધીનગર',
    businessName: user.businessName || 'બારોટ મોબિલિટી'
  });
});

// Admin Profile: Update Name, Phone, City, Password
app.put('/api/auth/profile', authMiddleware, (req, res) => {
  const users = readData('users');
  const index = users.findIndex(u => u.id === req.user.id);
  if (index === -1) return res.status(404).json({ error: 'યુઝર મળ્યો નથી' });

  const { fullName, phone, city, businessName, currentPassword, newPassword } = req.body;

  // If changing password, verify current password first
  if (newPassword) {
    if (!currentPassword) {
      return res.status(400).json({ error: 'નવો પાસવર્ડ સેટ કરવા માટે હાલનો જૂનો પાસવર્ડ લખો' });
    }
    const isCurrentValid = bcrypt.compareSync(currentPassword, users[index].passwordHash);
    if (!isCurrentValid) {
      return res.status(400).json({ error: 'હાલનો જૂનો પાસવર્ડ ખોટો છે' });
    }
    if (!validPassword(newPassword)) {
      return res.status(400).json({ error: 'નવો પાસવર્ડ ઓછામાં ઓછો ૮ અક્ષરનો હોવો જોઈએ' });
    }
    const salt = bcrypt.genSaltSync(10);
    users[index].passwordHash = bcrypt.hashSync(newPassword, salt);
  }

  if (fullName) users[index].fullName = fullName.trim();
  if (phone) users[index].phone = phone.trim();
  if (city) users[index].city = city.trim();
  if (businessName) users[index].businessName = businessName.trim();

  writeData('users', users);

  res.json({
    message: 'પ્રોફાઇલ સફળતાપૂર્વક અપડેટ થઈ ગઈ છે',
    user: {
      id: users[index].id,
      username: users[index].username,
      fullName: users[index].fullName,
      phone: users[index].phone,
      role: users[index].role,
      city: users[index].city,
      businessName: users[index].businessName
    }
  });
});

app.delete('/api/auth/account', authMiddleware, (req, res) => {
  const { currentPassword } = req.body;
  const users = readData('users');
  const user = users.find(item => item.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'યુઝર મળ્યો નથી' });
  if (!currentPassword || !bcrypt.compareSync(currentPassword, user.passwordHash)) {
    return res.status(401).json({ error: 'હાલનો પાસવર્ડ ખોટો છે' });
  }

  ['users', 'cars', 'drivers', 'carEntries', 'driverSalaries', 'personalFinance']
    .forEach(key => writeData(key, []));
  passwordResetRequests.delete(user.id);
  res.json({ message: 'એકાઉન્ટ અને તમામ એપ્લિકેશન ડેટા ડિલીટ થઈ ગયો છે' });
});

// =================== CARS API (CRUD) ===================
app.get('/api/cars', authMiddleware, (req, res) => {
  const cars = readData('cars');
  res.json(cars);
});

app.post('/api/cars', authMiddleware, (req, res) => {
  const cars = readData('cars');
  const newCar = {
    id: 'car-' + Date.now(),
    carNumber: req.body.carNumber ? req.body.carNumber.toUpperCase().trim() : '',
    model: req.body.model || '',
    owner: req.body.owner || 'હર્ષ બારોટ',
    status: req.body.status || 'ચાલુ (સક્રિય)',
    driverId: req.body.driverId || '',
    driverName: req.body.driverName || 'ડ્રાઇવર ફાળવેલ નથી',
    assignedDate: req.body.assignedDate || new Date().toISOString().split('T')[0]
  };
  cars.unshift(newCar);
  writeData('cars', cars);
  res.status(201).json(newCar);
});

app.put('/api/cars/:id', authMiddleware, (req, res) => {
  const cars = readData('cars');
  const index = cars.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'ગાડી મળી નથી' });
  
  cars[index] = { ...cars[index], ...req.body };
  if (req.body.carNumber) cars[index].carNumber = req.body.carNumber.toUpperCase().trim();
  writeData('cars', cars);
  res.json(cars[index]);
});

app.delete('/api/cars/:id', authMiddleware, (req, res) => {
  let cars = readData('cars');
  cars = cars.filter(c => c.id !== req.params.id);
  writeData('cars', cars);
  res.json({ success: true, message: 'ગાડી ડિલીટ થઈ ગઈ' });
});

// =================== DRIVERS API (CRUD) ===================
app.get('/api/drivers', authMiddleware, (req, res) => {
  const drivers = readData('drivers');
  res.json(drivers);
});

app.post('/api/drivers', authMiddleware, (req, res) => {
  const drivers = readData('drivers');
  const newDriver = {
    id: 'drv-' + Date.now(),
    name: req.body.name || '',
    phone: req.body.phone || '',
    monthlySalary: Number(req.body.monthlySalary) || 0,
    joinedDate: req.body.joinedDate || new Date().toISOString().split('T')[0],
    aadharNumber: req.body.aadharNumber || '',
    licenseNumber: req.body.licenseNumber || '',
    address: req.body.address || 'કલોલ, ગાંધીનગર',
    assignedCar: req.body.assignedCar || 'કોઈ નહીં',
    status: req.body.status || 'હાજર (સક્રિય)'
  };
  drivers.unshift(newDriver);
  writeData('drivers', drivers);
  res.status(201).json(newDriver);
});

app.put('/api/drivers/:id', authMiddleware, (req, res) => {
  const drivers = readData('drivers');
  const index = drivers.findIndex(d => d.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'ડ્રાઇવર મળ્યો નથી' });
  
  drivers[index] = { 
    ...drivers[index], 
    ...req.body,
    monthlySalary: req.body.monthlySalary !== undefined ? Number(req.body.monthlySalary) : drivers[index].monthlySalary
  };
  writeData('drivers', drivers);
  res.json(drivers[index]);
});

app.delete('/api/drivers/:id', authMiddleware, (req, res) => {
  let drivers = readData('drivers');
  drivers = drivers.filter(d => d.id !== req.params.id);
  writeData('drivers', drivers);
  res.json({ success: true, message: 'ડ્રાઇવર ડિલીટ થયો' });
});

// =================== CAR ENTRIES (CRUD: Create, Read, Update, Delete) ===================
app.get('/api/car-entries', authMiddleware, (req, res) => {
  let entries = readData('carEntries');
  const { carNumber, type, month } = req.query;

  if (carNumber && carNumber !== 'ALL') {
    entries = entries.filter(e => e.carNumber === carNumber);
  }
  if (type && type !== 'ALL') {
    entries = entries.filter(e => e.type === type);
  }
  if (month) {
    entries = entries.filter(e => e.date && e.date.startsWith(month));
  }

  entries.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(entries);
});

app.post('/api/car-entries', authMiddleware, (req, res) => {
  const entries = readData('carEntries');
  const newEntry = {
    id: 'ce-' + Date.now(),
    date: req.body.date || new Date().toISOString().split('T')[0],
    carNumber: req.body.carNumber ? req.body.carNumber.toUpperCase().trim() : '',
    driverName: req.body.driverName || 'હર્ષ બારોટ',
    type: req.body.type || 'આવક (ભાડું)',
    category: req.body.category || 'સામાન્ય',
    amount: Number(req.body.amount) || 0,
    notes: req.body.notes || ''
  };
  entries.unshift(newEntry);
  writeData('carEntries', entries);
  res.status(201).json(newEntry);
});

app.put('/api/car-entries/:id', authMiddleware, (req, res) => {
  const entries = readData('carEntries');
  const index = entries.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'એન્ટ્રી મળી નથી' });

  entries[index] = {
    ...entries[index],
    ...req.body,
    amount: req.body.amount !== undefined ? Number(req.body.amount) : entries[index].amount,
    carNumber: req.body.carNumber ? req.body.carNumber.toUpperCase().trim() : entries[index].carNumber
  };
  writeData('carEntries', entries);
  res.json(entries[index]);
});

app.delete('/api/car-entries/:id', authMiddleware, (req, res) => {
  let entries = readData('carEntries');
  entries = entries.filter(e => e.id !== req.params.id);
  writeData('carEntries', entries);
  res.json({ success: true, message: 'એન્ટ્રી ડિલીટ થઈ ગઈ' });
});

// =================== DRIVER SALARIES (CRUD) ===================
app.get('/api/salaries', authMiddleware, (req, res) => {
  let salaries = readData('driverSalaries');
  const { driverId, month } = req.query;
  if (driverId && driverId !== 'ALL') {
    salaries = salaries.filter(s => s.driverId === driverId);
  }
  if (month) {
    salaries = salaries.filter(s => s.month === month);
  }
  salaries.sort((a, b) => (b.month || '').localeCompare(a.month || ''));
  res.json(salaries);
});

app.post('/api/salaries', authMiddleware, (req, res) => {
  const salaries = readData('driverSalaries');
  const baseSalary = Number(req.body.baseSalary) || 0;
  const advancePaid = Number(req.body.advancePaid) || 0;
  const bonus = Number(req.body.bonus) || 0;
  const netSalary = baseSalary + bonus - advancePaid;

  const newSalary = {
    id: 'sal-' + Date.now(),
    driverId: req.body.driverId || '',
    driverName: req.body.driverName || '',
    month: req.body.month || new Date().toISOString().slice(0, 7),
    baseSalary,
    advancePaid,
    bonus,
    netSalary,
    paymentStatus: req.body.paymentStatus || 'બાકી',
    paymentDate: req.body.paymentDate || '',
    paymentMode: req.body.paymentMode || 'રોકડ (Cash)',
    notes: req.body.notes || ''
  };
  salaries.unshift(newSalary);
  writeData('driverSalaries', salaries);
  res.status(201).json(newSalary);
});

app.put('/api/salaries/:id', authMiddleware, (req, res) => {
  const salaries = readData('driverSalaries');
  const idx = salaries.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'પગાર એન્ટ્રી મળી નથી' });

  const updated = { ...salaries[idx], ...req.body };
  const baseSalary = Number(updated.baseSalary) || 0;
  const bonus = Number(updated.bonus) || 0;
  const advancePaid = Number(updated.advancePaid) || 0;
  updated.baseSalary = baseSalary;
  updated.bonus = bonus;
  updated.advancePaid = advancePaid;
  updated.netSalary = baseSalary + bonus - advancePaid;

  salaries[idx] = updated;
  writeData('driverSalaries', salaries);
  res.json(salaries[idx]);
});

app.delete('/api/salaries/:id', authMiddleware, (req, res) => {
  let salaries = readData('driverSalaries');
  salaries = salaries.filter(s => s.id !== req.params.id);
  writeData('driverSalaries', salaries);
  res.json({ success: true, message: 'પગાર એન્ટ્રી ડિલીટ થઈ ગઈ' });
});

// =================== PERSONAL FINANCE (CRUD) ===================
app.get('/api/personal-finance', authMiddleware, (req, res) => {
  let pf = readData('personalFinance');
  const { type, month } = req.query;
  if (type && type !== 'ALL') {
    pf = pf.filter(p => p.type === type);
  }
  if (month) {
    pf = pf.filter(p => p.date && p.date.startsWith(month));
  }
  pf.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(pf);
});

app.post('/api/personal-finance', authMiddleware, (req, res) => {
  const pf = readData('personalFinance');
  const newPF = {
    id: 'pf-' + Date.now(),
    date: req.body.date || new Date().toISOString().split('T')[0],
    type: req.body.type || 'ખર્ચ',
    category: req.body.category || 'સામાન્ય',
    amount: Number(req.body.amount) || 0,
    account: req.body.account || 'રોકડ (Cash)',
    description: req.body.description || ''
  };
  pf.unshift(newPF);
  writeData('personalFinance', pf);
  res.status(201).json(newPF);
});

app.put('/api/personal-finance/:id', authMiddleware, (req, res) => {
  const pf = readData('personalFinance');
  const idx = pf.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'અંગત વ્યવહાર મળ્યો નથી' });

  pf[idx] = {
    ...pf[idx],
    ...req.body,
    amount: req.body.amount !== undefined ? Number(req.body.amount) : pf[idx].amount
  };
  writeData('personalFinance', pf);
  res.json(pf[idx]);
});

app.delete('/api/personal-finance/:id', authMiddleware, (req, res) => {
  let pf = readData('personalFinance');
  pf = pf.filter(p => p.id !== req.params.id);
  writeData('personalFinance', pf);
  res.json({ success: true, message: 'અંગત હિસાબ ડિલીટ થયો' });
});

// =================== AGGREGATED METRICS & CAR REPORT ===================
app.get('/api/analytics/car-monthly', authMiddleware, (req, res) => {
  const entries = readData('carEntries');
  const cars = readData('cars');
  const month = req.query.month || new Date().toISOString().slice(0, 7);

  const report = cars.map(car => {
    const carNum = car.carNumber;
    const carEntries = entries.filter(e => e.carNumber === carNum && e.date && e.date.startsWith(month));

    const income = carEntries.filter(e => e.type === 'આવક (ભાડું)').reduce((sum, e) => sum + e.amount, 0);
    const cngExpense = carEntries.filter(e => e.type === 'CNG ગેસ ખર્ચ').reduce((sum, e) => sum + e.amount, 0);
    const serviceExpense = carEntries.filter(e => e.type === 'ગાડી સર્વિસ ખર્ચ').reduce((sum, e) => sum + e.amount, 0);
    const otherExpense = carEntries.filter(e => e.type === 'અન્ય ખર્ચ').reduce((sum, e) => sum + e.amount, 0);

    const totalExpense = cngExpense + serviceExpense + otherExpense;
    const netProfit = income - totalExpense;

    return {
      carId: car.id,
      carNumber: carNum,
      model: car.model,
      driverName: car.driverName,
      status: car.status,
      month,
      income,
      cngExpense,
      serviceExpense,
      otherExpense,
      totalExpense,
      netProfit,
      tripsCount: carEntries.filter(e => e.type === 'આવક (ભાડું)').length
    };
  });

  res.json({ month, report });
});

app.get('/api/analytics/business-summary', authMiddleware, (req, res) => {
  const entries = readData('carEntries');
  const salaries = readData('driverSalaries');
  const pf = readData('personalFinance');
  const cars = readData('cars');
  const drivers = readData('drivers');

  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);

  const monthEntries = entries.filter(e => e.date && e.date.startsWith(currentMonth));
  const monthIncome = monthEntries.filter(e => e.type === 'આવક (ભાડું)').reduce((s, e) => s + e.amount, 0);
  const monthCng = monthEntries.filter(e => e.type === 'CNG ગેસ ખર્ચ').reduce((s, e) => s + e.amount, 0);
  const monthService = monthEntries.filter(e => e.type === 'ગાડી સર્વિસ ખર્ચ').reduce((s, e) => s + e.amount, 0);
  const monthOther = monthEntries.filter(e => e.type === 'અન્ય ખર્ચ').reduce((s, e) => s + e.amount, 0);

  const monthSalaries = salaries.filter(s => s.month === currentMonth && s.paymentStatus === 'ચુકવાઈ ગયેલ').reduce((s, e) => s + (e.netSalary || 0), 0);
  const totalFleetExpense = monthCng + monthService + monthOther + monthSalaries;
  const netBusinessProfit = monthIncome - totalFleetExpense;

  const monthPF = pf.filter(p => p.date && p.date.startsWith(currentMonth));
  const personalIncome = monthPF
    .filter(p => p.type === 'આવક' || p.type === 'અંગત આવક')
    .reduce((s, p) => s + p.amount, 0);
  const personalExpense = monthPF
    .filter(p => p.type === 'ખર્ચ' || p.type === 'ઘર खर्च')
    .reduce((s, p) => s + p.amount, 0);
  const personalSavings = personalIncome - personalExpense;

  res.json({
    currentMonth,
    totalCars: cars.length,
    activeDrivers: drivers.filter(d => d.status.includes('હાજર') || d.status === 'Active').length,
    monthIncome,
    monthCng,
    monthService,
    monthOther,
    monthSalaries,
    totalFleetExpense,
    netBusinessProfit,
    personalIncome,
    personalExpense,
    personalSavings
  });
});

// Fallback to React index.html for SPA routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Barot Mobility Backend running on port ${PORT}`);
});
