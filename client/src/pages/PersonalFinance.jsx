import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Lock
} from 'lucide-react';
import { formatINR } from '../utils/format';

export default function PersonalFinance({ personalFinance, onAddPersonal, onUpdatePersonal, onDeletePersonal }) {
  const [filterType, setFilterType] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'ઘર ખર્ચ',
    category: 'ઘર કરિયાણું અને રાશન',
    amount: '',
    account: 'રોકડ (Cash)',
    description: ''
  });

  const categories = {
    'અંગત આવક': [
      'ટેક્સી બિઝનેસ નફો ઉપાડ્યો',
      'દુકાન / મકાનનું ભાડું મળ્યું',
      'વ્યાજ / રોકાણની આવક',
      'અન્ય અંગત આવક'
    ],
    'ઘર ખર્ચ': [
      'ઘર કરિયાણું અને રાશન',
      'ઘર ભાડું / સોસાયટી મેન્ટેનન્સ',
      'બાળકોની સ્કૂલ / ટ્યુશન ફી',
      'લાઈટબિલ / ગેસ સિલિન્ડર બિલ',
      'SIP / મ્યુચ્યુઅલ ફંડ બચત',
      'દવા અને હોસ્પિટલ ખર્ચ',
      'કપડાં અને ખરીદી',
      'ગાડીનો પર્સનલ હપ્તો (EMI)',
      'સામાજિક પ્રસંગ / વ્યવહાર ખર્ચ',
      'પરચૂરણ ઘર ખર્ચ'
    ]
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'ઘર ખર્ચ',
      category: 'ઘર કરિયાણું અને રાશન',
      amount: '',
      account: 'રોકડ (Cash)',
      description: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      date: item.date,
      type: item.type,
      category: item.category,
      amount: item.amount,
      account: item.account || 'રોકડ (Cash)',
      description: item.description || ''
    });
    setIsModalOpen(true);
  };

  const handleTypeChange = (t) => {
    setFormData(prev => ({
      ...prev,
      type: t,
      category: categories[t][0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount) {
      alert('કૃપા કરીને રકમ લખો');
      return;
    }

    const payload = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (editingItem) {
      onUpdatePersonal(editingItem.id, payload);
    } else {
      onAddPersonal(payload);
    }
    setIsModalOpen(false);
  };

  const totalIncome = personalFinance.filter(p => p.type === 'અંગત આવક').reduce((s, p) => s + p.amount, 0);
  const totalExpense = personalFinance.filter(p => p.type === 'ઘર ખર્ચ').reduce((s, p) => s + p.amount, 0);
  const netSavings = totalIncome - totalExpense;

  const filteredPF = personalFinance.filter(p => {
    if (filterType === 'ALL') return true;
    return p.type === filterType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.4), rgba(15, 23, 42, 0.9))',
        border: '1px solid rgba(16, 185, 129, 0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-income" style={{ background: 'rgba(16, 185, 129, 0.25)', color: '#34d399' }}>
              <Lock size={12} /> હર્ષ ભાઈની અંગત તિજોરી
            </span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ઘર ખર્ચ અને બચત હિસાબ</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            અંગત નાણાકીય હિસાબ અને ઘર ખર્ચ
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
            ટેક્સી બિઝનેસમાંથી ઉપાડેલો નફો, ઘરનું કરિયાણું, ફી, મ્યુચ્યુઅલ ફંડ SIP અને અંગત બચતનો ચોપડો.
          </p>
        </div>

        <button 
          className="btn btn-success"
          onClick={openAddModal}
        >
          <Plus size={18} /> અંગત એન્ટ્રી ઉમેરો
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }}>
        <div className="glass-panel" style={{ padding: '20px 24px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>કુલ અંગત આવક</span>
            <TrendingUp size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '8px' }}>
            {formatINR(totalIncome)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>ટેક્સી નફો, મકાન ભાડું, રોકાણ</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px', borderLeft: '4px solid #f43f5e' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>કુલ ઘર ખર્ચ</span>
            <TrendingDown size={20} color="#f43f5e" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fda4af', marginTop: '8px' }}>
            {formatINR(totalExpense)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>રાશન, સ્કૂલ ફી, દવા, લાઈટબિલ</div>
        </div>

        <div className="glass-panel-glow" style={{ padding: '20px 24px', borderLeft: '4px solid #38bdf8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ચોખ્ખી અંગત બચત</span>
            <PiggyBank size={20} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: netSavings >= 0 ? '#38bdf8' : '#fda4af', marginTop: '8px' }}>
            {formatINR(netSavings)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            બચત દર: {totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', gap: '10px' }}>
        {['ALL', 'અંગત આવક', 'ઘર ખર્ચ'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: filterType === t ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              color: filterType === t ? '#34d399' : '#94a3b8',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            {t === 'ALL' ? 'બધો વ્યવહાર' : t === 'અંગત આવક' ? 'અંગત આવક' : 'ઘર ખર્ચ'}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>તારીખ</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>પ્રકાર</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>વિગત</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>ખાતું / પદ્ધતિ</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>વર્ણન</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'right' }}>રકમ</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>ક્રિયા</th>
              </tr>
            </thead>
            <tbody>
              {filteredPF.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    હજુ સુધી કોઈ અંગત વ્યવહાર નોંધાયેલ નથી. "+ અંગત એન્ટ્રી ઉમેરો" બટન દબાવો.
                  </td>
                </tr>
              ) : (
                filteredPF.map((item) => {
                  const isInc = item.type === 'અંગત આવક';
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>{item.date}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge ${isInc ? 'badge-income' : 'badge-pending'}`}>
                          {item.type}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#fff', fontWeight: 600 }}>{item.category}</td>
                      <td style={{ padding: '12px 14px', color: '#38bdf8' }}>{item.account || 'રોકડ'}</td>
                      <td style={{ padding: '12px 14px', color: '#94a3b8' }}>{item.description || '-'}</td>
                      <td style={{ 
                        padding: '12px 14px', 
                        textAlign: 'right', 
                        fontWeight: 700, 
                        color: isInc ? '#34d399' : '#f87171',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.95rem'
                      }}>
                        {isInc ? `+${formatINR(item.amount)}` : `-${formatINR(item.amount)}`}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => openEditModal(item)}
                            style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '4px' }}
                            title="સુધારો (Edit)"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => onDeletePersonal(item.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '18px' }}>
              {editingItem ? 'અંગત વ્યવહાર સુધારો (Edit Entry)' : 'અંગત વ્યવહાર / ઘર ખર્ચ ઉમેરો'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">પ્રકાર</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="form-select"
                  >
                    <option value="ઘર ખર્ચ">ઘર ખર્ચ (પરિવાર / ઘર)</option>
                    <option value="અંગત આવક">અંગત આવક (બિઝનેસ નફો ઉપાડ / અન્ય)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">તારીખ</label>
                  <input 
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">વિગત / કારણ</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-select"
                  >
                    {categories[formData.type]?.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">રકમ (₹ માં)</label>
                  <input 
                    type="number"
                    step="any"
                    required
                    placeholder="દા.ત. 3000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">ક્યાંથી ચુકવ્યું / બેંક ખાતું</label>
                <select 
                  value={formData.account}
                  onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                  className="form-select"
                >
                  <option value="રોકડ (Cash)">રોકડ (Cash)</option>
                  <option value="Google Pay / PhonePe / UPI">Google Pay / PhonePe / UPI</option>
                  <option value="SBI બેંક ખાતું">SBI પર્સનલ બેંક ખાતું</option>
                  <option value="HDFC બેંક ખાતું">HDFC બેંક ખાતું</option>
                  <option value="ક્રેડિટ કાર્ડ">ક્રેડિટ કાર્ડ</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">વધારાની નોંધ</label>
                <textarea 
                  rows="3"
                  placeholder="દા.ત. કલોલ ઘરનું માસિક કરિયાણું અથવા લાઈટબિલ"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
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
                  className="btn btn-success"
                >
                  {editingItem ? 'સુધારો સાચવો' : 'સેવ કરો'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
