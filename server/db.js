const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Clean initial empty database (No mock data)
const initialData = {
  users: [
    {
      id: 'admin-1',
      username: 'harsh',
      fullName: 'હર્ષ બારોટ (Harsh Barot)',
      passwordHash: '$2a$10$wT3oX99VdZ0hH19m9sO1fe5Q51XqMvW14l524.3G1wM4lM3lM3lM2', // default hashed or will handle plaintext fallback
      phone: '9825000000',
      role: 'admin',
      city: 'કલોલ, ગાંધીનગર'
    }
  ],
  cars: [],
  drivers: [],
  carEntries: [],
  driverSalaries: [],
  personalFinance: []
};

function readData(key) {
  const filePath = path.join(DATA_DIR, `${key}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(initialData[key] || [], null, 2));
    return initialData[key] || [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key}:`, err);
    return initialData[key] || [];
  }
}

function writeData(key, data) {
  const filePath = path.join(DATA_DIR, `${key}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Ensure database files exist with zero mock records
Object.keys(initialData).forEach(k => {
  const filePath = path.join(DATA_DIR, `${k}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(initialData[k], null, 2));
  }
});

module.exports = { readData, writeData };
