import React, { useState, useEffect } from 'react';
import AdminAuth from './components/AdminAuth';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CarAnalytics from './pages/CarAnalytics';
import CarEntries from './pages/CarEntries';
import VehiclesFleet from './pages/VehiclesFleet';
import DriversFleet from './pages/DriversFleet';
import DriverSalaries from './pages/DriverSalaries';
import PersonalFinance from './pages/PersonalFinance';
import AdminProfile from './pages/AdminProfile';
import UserGuide from './pages/UserGuide';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('barot_mobility_token') || '');
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('barot_mobility_user')) || null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [cars, setCars] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [personalFinance, setPersonalFinance] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Authenticated fetch helper
  const authFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      handleLogout();
      throw new Error('Unauthorized');
    }
    return res;
  };

  const refreshAllData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [carsRes, driversRes, entriesRes, salariesRes, pfRes, sumRes] = await Promise.all([
        authFetch('/api/cars').then(r => r.json()),
        authFetch('/api/drivers').then(r => r.json()),
        authFetch('/api/car-entries').then(r => r.json()),
        authFetch('/api/salaries').then(r => r.json()),
        authFetch('/api/personal-finance').then(r => r.json()),
        authFetch('/api/analytics/business-summary').then(r => r.json())
      ]);

      setCars(carsRes || []);
      setDrivers(driversRes || []);
      setEntries(entriesRes || []);
      setSalaries(salariesRes || []);
      setPersonalFinance(pfRes || []);
      setSummary(sumRes || null);
    } catch (err) {
      console.error('ડેટા લોડ કરવામાં મુશ્કેલી:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      refreshAllData();
    }
  }, [token]);

  const handleLoginSuccess = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('barot_mobility_token');
    localStorage.removeItem('barot_mobility_user');
    setToken('');
    setUser(null);
  };

  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('barot_mobility_user', JSON.stringify(updatedUser));
  };

  // CRUD Handlers for Cars
  const handleAddCar = async (carData) => {
    await authFetch('/api/cars', {
      method: 'POST',
      body: JSON.stringify(carData)
    });
    refreshAllData();
  };

  const handleUpdateCar = async (id, carData) => {
    await authFetch(`/api/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(carData)
    });
    refreshAllData();
  };

  const handleDeleteCar = async (id) => {
    if (window.confirm('શું તમે આ ગાડી ડિલીટ કરવા માંગો છો?')) {
      await authFetch(`/api/cars/${id}`, { method: 'DELETE' });
      refreshAllData();
    }
  };

  // CRUD Handlers for Drivers
  const handleAddDriver = async (driverData) => {
    await authFetch('/api/drivers', {
      method: 'POST',
      body: JSON.stringify(driverData)
    });
    refreshAllData();
  };

  const handleUpdateDriver = async (id, driverData) => {
    await authFetch(`/api/drivers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(driverData)
    });
    refreshAllData();
  };

  const handleDeleteDriver = async (id) => {
    if (window.confirm('શું તમે આ ડ્રાઇવર ડિલીટ કરવા માંગો છો?')) {
      await authFetch(`/api/drivers/${id}`, { method: 'DELETE' });
      refreshAllData();
    }
  };

  // CRUD Handlers for Entries
  const handleAddEntry = async (entryData) => {
    await authFetch('/api/car-entries', {
      method: 'POST',
      body: JSON.stringify(entryData)
    });
    refreshAllData();
  };

  const handleUpdateEntry = async (id, entryData) => {
    await authFetch(`/api/car-entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entryData)
    });
    refreshAllData();
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('શું તમે આ એન્ટ્રી કાઢી નાખવા માંગો છો?')) {
      await authFetch(`/api/car-entries/${id}`, { method: 'DELETE' });
      refreshAllData();
    }
  };

  // CRUD Handlers for Salaries
  const handleAddSalary = async (salaryData) => {
    await authFetch('/api/salaries', {
      method: 'POST',
      body: JSON.stringify(salaryData)
    });
    refreshAllData();
  };

  const handleUpdateSalary = async (id, salaryData) => {
    await authFetch(`/api/salaries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(salaryData)
    });
    refreshAllData();
  };

  const handleDeleteSalary = async (id) => {
    if (window.confirm('શું તમે આ પગાર વાઉચર કાઢી નાખવા માંગો છો?')) {
      await authFetch(`/api/salaries/${id}`, { method: 'DELETE' });
      refreshAllData();
    }
  };

  // CRUD Handlers for Personal Finance
  const handleAddPersonal = async (pfData) => {
    await authFetch('/api/personal-finance', {
      method: 'POST',
      body: JSON.stringify(pfData)
    });
    refreshAllData();
  };

  const handleUpdatePersonal = async (id, pfData) => {
    await authFetch(`/api/personal-finance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pfData)
    });
    refreshAllData();
  };

  const handleDeletePersonal = async (id) => {
    if (window.confirm('શું તમે આ અંગત હિસાબ કાઢી નાખવા માંગો છો?')) {
      await authFetch(`/api/personal-finance/${id}`, { method: 'DELETE' });
      refreshAllData();
    }
  };

  // If not authenticated, render Clean Admin Login
  if (!token) {
    return <AdminAuth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', width: '100vw', maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* Sidebar with Mobile Responsive Toggle */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout} 
      />

      {/* Main Content Area */}
      <main className="app-main" style={{ flex: 1, padding: '28px 36px', overflowY: 'auto', maxHeight: '100vh', width: '100%', maxWidth: '100vw' }}>
        {loading && entries.length === 0 && cars.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#94a3b8' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="pulse" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fbbf24' }}>
                બારોટ મોબિલિટી લોડ થઈ રહ્યું છે...
              </div>
              <p style={{ marginTop: '8px', fontSize: '0.85rem' }}>કલોલ ફ્લીટ ડેટાબેઝ સિંક થઈ રહ્યો છે</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard 
                summary={summary}
                cars={cars}
                entries={entries}
                setActiveTab={setActiveTab}
                onAddEntryClick={() => setActiveTab('car-entries')}
              />
            )}

            {activeTab === 'car-analytics' && (
              <CarAnalytics 
                cars={cars}
                token={token}
                onSelectCarForEntry={(carNum) => {
                  setActiveTab('car-entries');
                }}
              />
            )}

            {activeTab === 'car-entries' && (
              <CarEntries 
                entries={entries}
                cars={cars}
                drivers={drivers}
                onAddEntry={handleAddEntry}
                onUpdateEntry={handleUpdateEntry}
                onDeleteEntry={handleDeleteEntry}
              />
            )}

            {activeTab === 'cars' && (
              <VehiclesFleet 
                cars={cars}
                drivers={drivers}
                onAddCar={handleAddCar}
                onUpdateCar={handleUpdateCar}
                onDeleteCar={handleDeleteCar}
              />
            )}

            {activeTab === 'drivers' && (
              <DriversFleet 
                drivers={drivers}
                cars={cars}
                onAddDriver={handleAddDriver}
                onUpdateDriver={handleUpdateDriver}
                onDeleteDriver={handleDeleteDriver}
              />
            )}

            {activeTab === 'salaries' && (
              <DriverSalaries 
                salaries={salaries}
                drivers={drivers}
                onAddSalary={handleAddSalary}
                onUpdateSalary={handleUpdateSalary}
                onDeleteSalary={handleDeleteSalary}
              />
            )}

            {activeTab === 'personal' && (
              <PersonalFinance 
                personalFinance={personalFinance}
                onAddPersonal={handleAddPersonal}
                onUpdatePersonal={handleUpdatePersonal}
                onDeletePersonal={handleDeletePersonal}
              />
            )}

            {activeTab === 'profile' && (
              <AdminProfile 
                user={user} 
                token={token} 
                onProfileUpdated={handleProfileUpdated} 
              />
            )}

            {activeTab === 'guide' && (
              <UserGuide setActiveTab={setActiveTab} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
