import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  Edit3, 
  Search
} from 'lucide-react';
import { formatINR } from '../utils/format';

export default function CarEntries({ entries, cars, drivers, onAddEntry, onUpdateEntry, onDeleteEntry }) {
  const [filterCar, setFilterCar] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    carNumber: cars[0]?.carNumber || '',
    driverName: cars[0]?.driverName || 'હર્ષ બારોટ',
    type: 'આવક (ભાડું)',
    category: 'ઓલા / ઉબેર / લોકલ ફેરા',
    amount: '',
    notes: ''
  });

  const categoriesByType = {
    'આવક (ભાડું)': ['ઓલા / ઉબેર / લોકલ ફેરા', 'આઉટસ્ટેશન ટ્રીપ (બહારગામ)', 'એરપોર્ટ પીકઅપ/ડ્રોપ', 'કંપની/કોર્પોરેટ ડ્યુટી', 'આખો દિવસ રેન્ટલ', 'અન્ય ભાડું'],
    'CNG ગેસ ખર્ચ': ['CNG ગેસ રીફિલ', 'પેટ્રોલ (સ્ટાર્ટિંગ માટે)', 'ગેસ સિલિન્ડર હાઇડ્રો ટેસ્ટિંગ'],
    'ગાડી સર્વિસ ખર્ચ': ['એન્જિન ઓઇલ અને ફિલ્ટર', 'બ્રેક પેડ અને ડિસ્ક', 'ટાયર અને પંચર', 'સસ્પેન્શન / ક્લચ પ્લેટ', 'AC અને ઇલેક્ટ્રિકલ કામ', 'સંપૂર્ણ સર્વિસિંગ (શોરૂમ)'],
    'અન્ય ખર્ચ': ['FASTag / ટોલટેક્સ', 'ગાડી વોશિંગ અને પોલિશ', 'RTO ટેક્સ અને ચલણ', 'ઇન્સ્યોરન્સ હપ્તો (વીમો)', 'પોલીસ દંડ / પાર્કિંગ']
  };

  const openAddModal = () => {
    setEditingEntry(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      carNumber: cars[0]?.carNumber || '',
      driverName: cars[0]?.driverName || 'હર્ષ બારોટ',
      type: 'આવક (ભાડું)',
      category: 'ઓલા / ઉબેર / લોકલ ફેરા',
      amount: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (entry) => {
    setEditingEntry(entry);
    setFormData({
      date: entry.date,
      carNumber: entry.carNumber,
      driverName: entry.driverName || 'હર્ષ બારોટ',
      type: entry.type,
      category: entry.category,
      amount: entry.amount,
      notes: entry.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleCarChange = (carNum) => {
    const selectedCar = cars.find(c => c.carNumber === carNum);
    setFormData(prev => ({
      ...prev,
      carNumber: carNum,
      driverName: selectedCar ? selectedCar.driverName : 'હર્ષ બારોટ'
    }));
  };

  const handleTypeChange = (typeVal) => {
    const defaultCat = categoriesByType[typeVal]?.[0] || 'સામાન્ય';
    setFormData(prev => ({
      ...prev,
      type: typeVal,
      category: defaultCat
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.carNumber || !formData.amount) {
      alert('કૃપા કરીને ગાડી નંબર અને સાચી રકમ લખો');
      return;
    }

    const payload = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (editingEntry) {
      onUpdateEntry(editingEntry.id, payload);
    } else {
      onAddEntry(payload);
    }
    setIsModalOpen(false);
  };

  const filteredEntries = entries.filter(e => {
    const matchesCar = filterCar === 'ALL' || e.carNumber === filterCar;
    const matchesType = filterType === 'ALL' || e.type === filterType;
    const matchesSearch = !searchQuery || 
      e.carNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.driverName && e.driverName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.category && e.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCar && matchesType && matchesSearch;
  });

  const totalFilteredIncome = filteredEntries.filter(e => e.type === 'આવક (ભાડું)').reduce((s, e) => s + e.amount, 0);
  const totalFilteredExpense = filteredEntries.filter(e => e.type !== 'આવક (ભાડું)').reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Header Card */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-cng">રોજિંદો હિસાબ ચોપડો</span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>કલોલ ફ્લીટ વ્યવહાર</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            રોજિંદી આવક અને ખર્ચની એન્ટ્રી
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
            રોજના ભાડાની રકમ, CNG પંપના બિલ, ગેરેજ સર્વિસિંગ બિલ અને ટોલટેક્સ એડ, એડિટ અને ડિલીટ કરો.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => {
            if (cars.length === 0) {
              alert('પહેલા "મારી ગાડીઓ" વિભાગમાં જઈને ગાડી નંબર ઉમેરો!');
              return;
            }
            openAddModal();
          }}
        >
          <Plus size={18} /> નવી એન્ટ્રી ઉમેરો
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '18px 24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', flex: 1 }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input 
              type="text"
              placeholder="શોધો: ગાડી, ડ્રાઇવર, પંપ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px' }}
            />
          </div>

          {/* Car Filter */}
          <div>
            <select 
              value={filterCar} 
              onChange={(e) => setFilterCar(e.target.value)}
              className="form-select"
              style={{ width: '170px' }}
            >
              <option value="ALL">બધી ગાડીઓ ({cars.length})</option>
              {cars.map(c => (
                <option key={c.id} value={c.carNumber}>{c.carNumber}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="form-select"
              style={{ width: '180px' }}
            >
              <option value="ALL">બધા પ્રકારના વ્યવહાર</option>
              <option value="આવક (ભાડું)">🟢 ભાડાની આવક</option>
              <option value="CNG ગેસ ખર્ચ">🟡 CNG ગેસ ખર્ચ</option>
              <option value="ગાડી સર્વિસ ખર્ચ">🔵 ગાડી સર્વિસ ખર્ચ</option>
              <option value="અન્ય ખર્ચ">🟣 અન્ય ખર્ચ</option>
            </select>
          </div>
        </div>

        {/* Quick summary stats */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>કુલ આવક: </span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399' }}>{formatINR(totalFilteredIncome)}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>કુલ ખર્ચ: </span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f87171' }}>{formatINR(totalFilteredExpense)}</span>
          </div>
        </div>
      </div>

      {/* Entries Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>તારીખ</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>ગાડી નંબર</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>ડ્રાઇવર</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>પ્રકાર</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>વિગત</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>નોંધ / પંપનું નામ</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'right' }}>રકમ</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'center' }}>ક્રિયા</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    હજુ સુધી કોઈ એન્ટ્રી નથી. ઉપર આપેલા "+ નવી એન્ટ્રી ઉમેરો" બટનથી શરૂઆત કરો.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((e) => {
                  const isInc = e.type === 'આવક (ભાડું)';
                  return (
                    <tr key={e.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>{e.date}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ 
                          fontFamily: 'var(--font-mono)', 
                          padding: '3px 8px', 
                          background: '#070c18', 
                          borderRadius: '6px', 
                          border: '1px solid rgba(255, 255, 255, 0.1)', 
                          color: '#fbbf24', 
                          fontWeight: 700 
                        }}>
                          {e.carNumber}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#fff' }}>{e.driverName}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge ${
                          e.type === 'આવક (ભાડું)' ? 'badge-income' :
                          e.type === 'CNG ગેસ ખર્ચ' ? 'badge-cng' :
                          e.type === 'ગાડી સર્વિસ ખર્ચ' ? 'badge-service' : 'badge-other'
                        }`}>
                          {e.type}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>{e.category}</td>
                      <td style={{ padding: '12px 14px', color: '#94a3b8', maxWidth: '280px' }}>
                        {e.notes || '-'}
                      </td>
                      <td style={{ 
                        padding: '12px 14px', 
                        textAlign: 'right', 
                        fontWeight: 700, 
                        color: isInc ? '#34d399' : '#f87171',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.95rem'
                      }}>
                        {isInc ? `+${formatINR(e.amount)}` : `-${formatINR(e.amount)}`}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button 
                            onClick={() => openEditModal(e)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#38bdf8',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                            title="સુધારો (Edit)"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button 
                            onClick={() => onDeleteEntry(e.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#fda4af',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
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

      {/* Entry Modal (Add & Edit) */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '18px' }}>
              {editingEntry ? 'એન્ટ્રી સુધારો (Edit Entry)' : 'નવી રોજિંદી એન્ટ્રી ઉમેરો'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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

                <div className="form-group">
                  <label className="form-label">ગાડી નંબર</label>
                  <select 
                    value={formData.carNumber}
                    onChange={(e) => handleCarChange(e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="">ગાડી પસંદ કરો</option>
                    {cars.map(c => (
                      <option key={c.id} value={c.carNumber}>{c.carNumber} ({c.model})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">પ્રકાર પસંદ કરો</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="form-select"
                  >
                    <option value="આવક (ભાડું)">🟢 આવક (ભાડું / ફેરા)</option>
                    <option value="CNG ગેસ ખર્ચ">🟡 CNG ગેસ ખર્ચ</option>
                    <option value="ગાડી સર્વિસ ખર્ચ">🔵 ગાડી સર્વિસિંગ / સ્પેરપાર્ટ</option>
                    <option value="અન્ય ખર્ચ">🟣 અન્ય ખર્ચ (વોશિંગ, ટોલ, દંડ)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">વિગત / કારણ</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="વિગત અથવા કારણ લખો"
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">રકમ (₹ માં)</label>
                  <input 
                    type="number"
                    step="any"
                    required
                    placeholder="દા.ત. 1500"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">હાજર ડ્રાઇવરનું નામ</label>
                  <select
                    value={formData.driverName}
                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                    className="form-select"
                  >
                    <option value="હર્ષ બારોટ">હર્ષ બારોટ</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.name}>{driver.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">નોંધ / પંપનું નામ / વધારાની વિગત</label>
                <textarea 
                  rows="3"
                  placeholder="દા.ત. અદાણી CNG પંપ કલોલ બાયપાસ, ફૂલ સિલિન્ડર ભરાવ્યો"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                  className="btn btn-primary"
                >
                  {editingEntry ? 'સુધારો સાચવો (Update)' : 'એન્ટ્રી સેવ કરો'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
