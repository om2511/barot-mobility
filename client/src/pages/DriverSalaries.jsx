import React, { useState } from 'react';
import { 
  Banknote, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Calendar
} from 'lucide-react';
import { formatINR, getMonthNameGujarati } from '../utils/format';

export default function DriverSalaries({ salaries, drivers, onAddSalary, onUpdateSalary, onDeleteSalary }) {
  const [filterMonth, setFilterMonth] = useState('2026-03');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState(null);

  const [formData, setFormData] = useState({
    driverId: drivers[0]?.id || '',
    driverName: drivers[0]?.name || '',
    month: '2026-03',
    baseSalary: drivers[0]?.monthlySalary || '',
    advancePaid: '0',
    bonus: '0',
    paymentStatus: 'બાકી',
    paymentDate: '',
    paymentMode: 'રોકડ (Cash)',
    notes: ''
  });

  const openAddModal = () => {
    setEditingSalary(null);
    setFormData({
      driverId: drivers[0]?.id || '',
      driverName: drivers[0]?.name || '',
      month: '2026-03',
      baseSalary: drivers[0]?.monthlySalary || '',
      advancePaid: '0',
      bonus: '0',
      paymentStatus: 'બાકી',
      paymentDate: '',
      paymentMode: 'રોકડ (Cash)',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sal) => {
    setEditingSalary(sal);
    setFormData({
      driverId: sal.driverId,
      driverName: sal.driverName,
      month: sal.month,
      baseSalary: sal.baseSalary,
      advancePaid: sal.advancePaid,
      bonus: sal.bonus,
      paymentStatus: sal.paymentStatus,
      paymentDate: sal.paymentDate || '',
      paymentMode: sal.paymentMode || 'રોકડ (Cash)',
      notes: sal.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleDriverSelect = (driverId) => {
    const drv = drivers.find(d => d.id === driverId);
    setFormData(prev => ({
      ...prev,
      driverId: driverId,
      driverName: drv ? drv.name : '',
      baseSalary: drv ? drv.monthlySalary : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.driverId || !formData.baseSalary) {
      alert('કૃપા કરીને ડ્રાઇવર પસંદ કરો અને પગાર લખો');
      return;
    }

    const payload = {
      ...formData,
      baseSalary: parseFloat(formData.baseSalary) || 0,
      advancePaid: parseFloat(formData.advancePaid) || 0,
      bonus: parseFloat(formData.bonus) || 0
    };

    if (editingSalary) {
      onUpdateSalary(editingSalary.id, payload);
    } else {
      onAddSalary(payload);
    }
    setIsModalOpen(false);
  };

  const handleMarkAsPaid = (sal) => {
    onUpdateSalary(sal.id, {
      paymentStatus: 'ચુકવાઈ ગયેલ',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode: sal.paymentMode || 'રોકડ (Cash)'
    });
  };

  const filteredSalaries = salaries.filter(s => {
    const matchMonth = !filterMonth || s.month === filterMonth;
    const matchStatus = filterStatus === 'ALL' || s.paymentStatus === filterStatus;
    return matchMonth && matchStatus;
  });

  const totalPayrollDue = filteredSalaries.reduce((sum, s) => sum + (s.netSalary || 0), 0);
  const totalPaidOut = filteredSalaries.filter(s => s.paymentStatus === 'ચુકવાઈ ગયેલ').reduce((sum, s) => sum + (s.netSalary || 0), 0);
  const totalPending = filteredSalaries.filter(s => s.paymentStatus === 'બાકી').reduce((sum, s) => sum + (s.netSalary || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-income">પગાર રજીસ્ટર</span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ડ્રાઇવર પેરોલ</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            ડ્રાઇવર પગાર વ્યવસ્થાપન
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
            ડ્રાઇવરનો માસિક ફિક્સ પગાર, ઉપાડ (એડવાન્સ) ની બાદબાકી, બોનસ અને ચુકવણીનો હિસાબ.
          </p>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={() => {
            if (drivers.length === 0) {
              alert('પહેલા "મારા ડ્રાઇવરો" વિભાગમાં જઈને ડ્રાઇવરનું નામ ઉમેરો!');
              return;
            }
            openAddModal();
          }}
        >
          <Plus size={18} /> પગાર પત્રક (વાઉચર) બનાવો
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div className="glass-panel" style={{ padding: '18px 22px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>કુલ પગાર ખર્ચ ({getMonthNameGujarati(filterMonth)})</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#c084fc', marginTop: '4px' }}>
            {formatINR(totalPayrollDue)}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px 22px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ચુકવાઈ ગયેલ રકમ</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
            {formatINR(totalPaidOut)}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px 22px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ચૂકવવાની બાકી રકમ</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
            {formatINR(totalPending)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label className="form-label" style={{ margin: 0 }}>પગાર મહિનો:</label>
          <input 
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="form-input"
            style={{ width: '160px', padding: '6px 12px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label className="form-label" style={{ margin: 0 }}>ચુકવણી સ્થિતિ:</label>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-select"
            style={{ width: '160px', padding: '6px 12px' }}
          >
            <option value="ALL">બધી સ્થિતિ</option>
            <option value="ચુકવાઈ ગયેલ">ચુકવાઈ ગયેલ</option>
            <option value="બાકી">બાકી (Pending)</option>
          </select>
        </div>
      </div>

      {/* Salaries Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>મહિનો</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>ડ્રાઇવરનું નામ</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>ફિક્સ પગાર</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>ઉપાડ / એડવાન્સ</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>બોનસ / ભથ્થું</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, color: '#38bdf8' }}>ચૂકવવાપાત્ર રકમ</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>સ્થિતિ</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>ચુકવણી પદ્ધતિ</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>ક્રિયા</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalaries.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    આ મહિના માટે કોઈ પગાર વાઉચર નથી. "+ પગાર પત્રક બનાવો" બટન દબાવો.
                  </td>
                </tr>
              ) : (
                filteredSalaries.map((sal) => {
                  const isPaid = sal.paymentStatus === 'ચુકવાઈ ગયેલ';
                  return (
                    <tr key={sal.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '12px 14px', color: '#cbd5e1', fontWeight: 600 }}>{sal.month}</td>
                      <td style={{ padding: '12px 14px', color: '#fff', fontWeight: 600 }}>{sal.driverName}</td>
                      <td style={{ padding: '12px 14px', color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>{formatINR(sal.baseSalary)}</td>
                      <td style={{ padding: '12px 14px', color: '#fda4af', fontFamily: 'var(--font-mono)' }}>-{formatINR(sal.advancePaid)}</td>
                      <td style={{ padding: '12px 14px', color: '#34d399', fontFamily: 'var(--font-mono)' }}>+{formatINR(sal.bonus)}</td>
                      <td style={{ padding: '12px 14px', color: '#fbbf24', fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>
                        {formatINR(sal.netSalary)}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge ${isPaid ? 'badge-paid' : 'badge-pending'}`}>
                          {sal.paymentStatus}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#94a3b8' }}>
                        {isPaid ? `${sal.paymentMode || 'રોકડ'} (${sal.paymentDate || 'ચુકતે'})` : 'ચુકવવાનો બાકી'}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          {!isPaid && (
                            <button
                              onClick={() => handleMarkAsPaid(sal)}
                              className="btn btn-success"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            >
                              <CheckCircle size={13} /> ચુકતે કરો
                            </button>
                          )}
                          <button
                            onClick={() => openEditModal(sal)}
                            style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '4px' }}
                            title="સુધારો (Edit)"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => onDeleteSalary(sal.id)}
                            style={{ background: 'transparent', border: 'none', color: '#fda4af', cursor: 'pointer', padding: '4px' }}
                            title="કાઢી નાખો (Delete)"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Voucher Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '18px' }}>
              {editingSalary ? 'પગાર પત્રક સુધારો (Edit Voucher)' : 'ડ્રાઇવર પગાર વાઉચર બનાવો'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">ડ્રાઇવર પસંદ કરો</label>
                  <select 
                    value={formData.driverId}
                    onChange={(e) => handleDriverSelect(e.target.value)}
                    className="form-select"
                    required
                  >
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({formatINR(d.monthlySalary)}/મહિને)</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">પગાર મહિનો</label>
                  <input 
                    type="month"
                    required
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">ફિક્સ પગાર (₹)</label>
                  <input 
                    type="number"
                    required
                    value={formData.baseSalary}
                    onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ઉપાડ કાપો (₹)</label>
                  <input 
                    type="number"
                    value={formData.advancePaid}
                    onChange={(e) => setFormData({ ...formData, advancePaid: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">બોનસ ઉમેરો (₹)</label>
                  <input 
                    type="number"
                    value={formData.bonus}
                    onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">ચુકવણી સ્થિતિ</label>
                  <select 
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="form-select"
                  >
                    <option value="બાકી">બાકી (Pending)</option>
                    <option value="ચુકવાઈ ગયેલ">ચુકવાઈ ગયેલ (Paid)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">ચુકવણી પદ્ધતિ</label>
                  <select 
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                    className="form-select"
                  >
                    <option value="રોકડ (Cash)">રોકડ (Cash)</option>
                    <option value="Google Pay / PhonePe / UPI">Google Pay / PhonePe / UPI</option>
                    <option value="બેંક ટ્રાન્સફર (NEFT)">બેંક ટ્રાન્સફર (NEFT)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">નોંધ / રિમાર્કસ</label>
                <input 
                  type="text"
                  placeholder="દા.ત. આ મહિનાનો પૂરો પગાર ચુકતે કર્યો"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                  {editingSalary ? 'સુધારો સાચવો' : 'વાઉચર સેવ કરો'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
