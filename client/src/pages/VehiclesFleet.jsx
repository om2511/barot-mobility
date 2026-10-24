import React, { useState } from 'react';
import { 
  Car, 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  UserCheck
} from 'lucide-react';

export default function VehiclesFleet({ cars, drivers, onAddCar, onDeleteCar, onUpdateCar }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  const [formData, setFormData] = useState({
    carNumber: '',
    model: '',
    owner: 'હર્ષ બારોટ',
    status: 'ચાલુ (સક્રિય)',
    driverId: '',
    driverName: 'ડ્રાઇવર ફાળવેલ નથી',
    assignedDate: new Date().toISOString().split('T')[0]
  });

  const openAddModal = () => {
    setEditingCar(null);
    setFormData({
      carNumber: '',
      model: '',
      owner: 'હર્ષ બારોટ',
      status: 'ચાલુ (સક્રિય)',
      driverId: '',
      driverName: 'ડ્રાઇવર ફાળવેલ નથી',
      assignedDate: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const openEditModal = (car) => {
    setEditingCar(car);
    setFormData({
      carNumber: car.carNumber,
      model: car.model,
      owner: car.owner || 'હર્ષ બારોટ',
      status: car.status || 'ચાલુ (સક્રિય)',
      driverId: car.driverId || '',
      driverName: car.driverName || 'ડ્રાઇવર ફાળવેલ નથી',
      assignedDate: car.assignedDate || ''
    });
    setIsModalOpen(true);
  };

  const handleDriverChange = (driverId) => {
    if (!driverId) {
      setFormData(prev => ({ ...prev, driverId: '', driverName: 'ડ્રાઇવર ફાળવેલ નથી' }));
      return;
    }
    const drv = drivers.find(d => d.id === driverId);
    setFormData(prev => ({
      ...prev,
      driverId: driverId,
      driverName: drv ? drv.name : 'ડ્રાઇવર ફાળવેલ નથી'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.carNumber || !formData.model) {
      alert('કૃપા કરીને ગાડી નંબર અને મોડેલનું નામ લખો');
      return;
    }

    if (editingCar) {
      onUpdateCar(editingCar.id, formData);
    } else {
      onAddCar(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-service">ગાડીઓની યાદી</span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>કલોલ ટેક્સી હબ</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            મારી ગાડીઓનું સંચાલન
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
            તમારી માલિકીની બધી ગાડીઓ, મોડેલ, ગાડી નંબર અને સોંપેલા ડ્રાઇવરોની વિગત.
          </p>
        </div>

        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> નવી ગાડી ઉમેરો
        </button>
      </div>

      {/* Grid of Cars */}
      {cars.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Car size={40} color="#64748b" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>હજુ એક પણ ગાડી નોંધાયેલ નથી</h3>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>ઉપર આપેલા "+ નવી ગાડી ઉમેરો" બટન પર ક્લિક કરીને તમારી ટેક્સી રજીસ્ટર કરો.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {cars.map((car) => {
            return (
              <div 
                key={car.id} 
                className="glass-panel"
                style={{
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Car size={24} color="#fbbf24" />
                    </div>
                    <div>
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: '#fbbf24',
                        letterSpacing: '1px'
                      }}>
                        {car.carNumber}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: '#94a3b8', marginTop: '2px' }}>
                        {car.model}
                      </div>
                    </div>
                  </div>

                  <span className={`badge ${car.status.includes('ચાલુ') || car.status === 'Active' ? 'badge-active' : 'badge-pending'}`}>
                    {car.status}
                  </span>
                </div>

                {/* Details card */}
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
                    <span style={{ color: '#94a3b8' }}>સોંપેલ ડ્રાઇવર:</span>
                    <span style={{ color: '#38bdf8', fontWeight: 600 }}>{car.driverName || 'ડ્રાઇવર ફાળવેલ નથી'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>માલિક:</span>
                    <span style={{ color: '#fff', fontWeight: 500 }}>{car.owner || 'હર્ષ બારોટ'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>ફાળવણી તારીખ:</span>
                    <span style={{ color: '#cbd5e1' }}>{car.assignedDate || 'લાગુ નથી'}</span>
                  </div>
                </div>

                {/* Action row */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    onClick={() => openEditModal(car)}
                  >
                    <Edit3 size={14} /> સુધારો
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    onClick={() => onDeleteCar(car.id)}
                  >
                    <Trash2 size={14} /> કાઢી નાખો
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Car Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '18px' }}>
              {editingCar ? 'ગાડીની વિગતમાં ફેરફાર કરો' : 'નવી ટેક્સી / ગાડી રજીસ્ટર કરો'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">ગાડી નંબર (દા.ત. GJ-18-BB-1001)</label>
                <input 
                  type="text"
                  required
                  placeholder="GJ-18-XX-0000"
                  value={formData.carNumber}
                  onChange={(e) => setFormData({ ...formData, carNumber: e.target.value })}
                  className="form-input font-mono"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">ગાડીનું મોડેલ અને કંપની</label>
                <input 
                  type="text"
                  required
                  placeholder="દા.ત. મારુતિ સુઝુકી અર્ટિગા CNG / ડિઝાયર ટૂર S"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">ડ્રાઇવર ફાળવો</label>
                  <select 
                    value={formData.driverId}
                    onChange={(e) => handleDriverChange(e.target.value)}
                    className="form-select"
                  >
                    <option value="">કોઈ નહીં (ડ્રાઇવર વગર)</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.phone})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">ગાડીની સ્થિતિ (Status)</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="form-select"
                  >
                    <option value="ચાલુ (સક્રિય)">ચાલુ (સક્રિય / રોડ પર)</option>
                    <option value="મેન્ટેનન્સ (ગેરેજમાં)">મેન્ટેનન્સ (ગેરેજમાં)</option>
                    <option value="બંધ (સ્ટેન્ડબાય)">બંધ (સ્ટેન્ડબાય)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">માલિકનું નામ</label>
                  <input 
                    type="text"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">શરૂઆતની તારીખ</label>
                  <input 
                    type="date"
                    value={formData.assignedDate}
                    onChange={(e) => setFormData({ ...formData, assignedDate: e.target.value })}
                    className="form-input"
                  />
                </div>
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
                  {editingCar ? 'વિગત સુધારો' : 'ગાડી સેવ કરો'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
