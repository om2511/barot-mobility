import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Phone, 
  Banknote,
  Car
} from 'lucide-react';
import { formatINR } from '../utils/format';

export default function DriversFleet({ drivers, cars, onAddDriver, onDeleteDriver, onUpdateDriver }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    monthlySalary: '',
    joinedDate: new Date().toISOString().split('T')[0],
    aadharNumber: '',
    licenseNumber: '',
    address: 'કલોલ, ગાંધીનગર',
    assignedCar: 'કોઈ નહીં',
    status: 'હાજર (સક્રિય)'
  });

  const openAddModal = () => {
    setEditingDriver(null);
    setFormData({
      name: '',
      phone: '',
      monthlySalary: '',
      joinedDate: new Date().toISOString().split('T')[0],
      aadharNumber: '',
      licenseNumber: '',
      address: 'કલોલ, ગાંધીનગર',
      assignedCar: 'કોઈ નહીં',
      status: 'હાજર (સક્રિય)'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      phone: driver.phone,
      monthlySalary: driver.monthlySalary,
      joinedDate: driver.joinedDate || '',
      aadharNumber: driver.aadharNumber || '',
      licenseNumber: driver.licenseNumber || '',
      address: driver.address || '',
      assignedCar: driver.assignedCar || 'કોઈ નહીં',
      status: driver.status || 'હાજર (સક્રિય)'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.monthlySalary) {
      alert('કૃપા કરીને ડ્રાઇવરનું નામ અને માસિક ફિક્સ પગાર લખો');
      return;
    }

    const payload = {
      ...formData,
      monthlySalary: parseFloat(formData.monthlySalary)
    };

    if (editingDriver) {
      onUpdateDriver(editingDriver.id, payload);
    } else {
      onAddDriver(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-active">પગારદાર ડ્રાઇવરો</span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>કલોલ ટેક્સી ટીમ</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            ડ્રાઇવર સ્ટાફનું સંચાલન
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
            મહિનાના ફિક્સ પગાર પર રાખેલા ડ્રાઇવરો, મોબાઈલ નંબર, લાયસન્સ અને સોંપેલી ગાડીની વિગત.
          </p>
        </div>

        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> નવો ડ્રાઇવર ઉમેરો
        </button>
      </div>

      {/* Driver Cards */}
      {drivers.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Users size={40} color="#64748b" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>હજુ એક પણ ડ્રાઇવર નોંધાયેલ નથી</h3>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>ઉપર આપેલા "+ નવો ડ્રાઇવર ઉમેરો" બટનથી તમારા ડ્રાઈવરનું નામ અને પગાર રજીસ્ટર કરો.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {drivers.map((drv) => {
            return (
              <div 
                key={drv.id} 
                className="glass-panel"
                style={{
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: '#38bdf8'
                    }}>
                      {drv.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                        {drv.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Phone size={12} color="#10b981" /> {drv.phone}
                      </div>
                    </div>
                  </div>

                  <span className={`badge ${drv.status.includes('હાજર') || drv.status === 'Active' ? 'badge-active' : 'badge-pending'}`}>
                    {drv.status}
                  </span>
                </div>

                {/* Salary & details badge */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  padding: '14px',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>નક્કી કરેલ માસિક પગાર:</span>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>{formatINR(drv.monthlySalary)} / મહિને</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>સોંપેલી ગાડી:</span>
                    <span style={{ color: '#fbbf24', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{drv.assignedCar}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>ડ્રાઇવિંગ લાયસન્સ:</span>
                    <span style={{ color: '#cbd5e1' }}>{drv.licenseNumber || 'ચકાસેલ છે'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>સરનામું:</span>
                    <span style={{ color: '#94a3b8' }}>{drv.address}</span>
                  </div>
                </div>

                {/* Action row */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    onClick={() => openEditModal(drv)}
                  >
                    <Edit3 size={14} /> સુધારો
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    onClick={() => onDeleteDriver(drv.id)}
                  >
                    <Trash2 size={14} /> કાઢી નાખો
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Driver Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '18px' }}>
              {editingDriver ? 'ડ્રાઇવર પ્રોફાઇલ સુધારો' : 'નવા ડ્રાઇવરની નોંધણી કરો'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">ડ્રાઇવરનું પૂરું નામ</label>
                  <input 
                    type="text"
                    required
                    placeholder="દા.ત. રમેશભાઈ પટેલ"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">મોબાઈલ નંબર</label>
                  <input 
                    type="tel"
                    required
                    placeholder="દા.ત. 98250 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">માસિક ફિક્સ પગાર (₹ માં)</label>
                  <input 
                    type="number"
                    required
                    placeholder="દા.ત. 16000"
                    value={formData.monthlySalary}
                    onChange={(e) => setFormData({ ...formData, monthlySalary: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ચલાવવા માટે ગાડી ફાળવો</label>
                  <select 
                    value={formData.assignedCar}
                    onChange={(e) => setFormData({ ...formData, assignedCar: e.target.value })}
                    className="form-select"
                  >
                    <option value="કોઈ નહીં">કોઈ નહીં (સ્પેર ડ્રાઇવર)</option>
                    {cars.map(c => (
                      <option key={c.id} value={c.carNumber}>{c.carNumber} ({c.model})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">ડ્રાઇવિંગ લાયસન્સ નંબર</label>
                  <input 
                    type="text"
                    placeholder="GJ18XXXXXXXXXX"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">આધાર કાર્ડ નંબર</label>
                  <input 
                    type="text"
                    placeholder="XXXX-XXXX-XXXX"
                    value={formData.aadharNumber}
                    onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">રહેઠાણનું સરનામું (કલોલ/ગાંધીનગર)</label>
                <input 
                  type="text"
                  placeholder="દા.ત. ભાવસાર વાડો, કલોલ"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  રદ કરો
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  {editingDriver ? 'વિગત સુધારો' : 'ડ્રાઇવર સેવ કરો'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
