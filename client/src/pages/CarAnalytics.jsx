import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Fuel, 
  Wrench, 
  Receipt, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  Plus
} from 'lucide-react';
import { formatINR, getMonthNameGujarati } from '../utils/format';

export default function CarAnalytics({ cars, onSelectCarForEntry, token }) {
  const [selectedMonth, setSelectedMonth] = useState('2026-03');
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCar, setFilterCar] = useState('ALL');

  const fetchCarAnalytics = async (month) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/car-monthly?month=${month}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setAnalyticsData(data.report || []);
    } catch (err) {
      console.error('ગાડીવાર હિસાબ લોડ કરવામાં ભૂલ:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCarAnalytics(selectedMonth);
    }
  }, [selectedMonth, token]);

  const displayedCars = filterCar === 'ALL' 
    ? analyticsData 
    : analyticsData.filter(c => c.carNumber === filterCar);

  const totalFleetIncome = displayedCars.reduce((s, c) => s + c.income, 0);
  const totalFleetCNG = displayedCars.reduce((s, c) => s + c.cngExpense, 0);
  const totalFleetService = displayedCars.reduce((s, c) => s + c.serviceExpense, 0);
  const totalFleetOther = displayedCars.reduce((s, c) => s + c.otherExpense, 0);
  const totalFleetProfit = displayedCars.reduce((s, c) => s + c.netProfit, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header & Controls */}
      <div className="glass-panel" style={{
        padding: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-service">ગાડીવાર ચોખ્ખો હિસાબ</span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>મુખ્ય બિઝનેસ ફોર્મ્યુલા</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            ગાડી નંબર પ્રમાણે માસિક આવક અને ખર્ચ
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>
            દરેક ગાડીએ મહિનામાં કેટલું કમાવી આપ્યું, CNG ગેસ કેટલો બળ્યો, સર્વિસ ખર્ચ કેટલો થયો અને ચોખ્ખો નફો કેટલો રહ્યો.
          </p>
        </div>

        {/* Filter controls */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label className="form-label">મહિનો પસંદ કરો</label>
            <input 
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="form-input"
              style={{ width: '160px', padding: '8px 12px' }}
            />
          </div>

          <div>
            <label className="form-label">ગાડી ફિલ્ટર</label>
            <select 
              value={filterCar} 
              onChange={(e) => setFilterCar(e.target.value)}
              className="form-select"
              style={{ width: '180px', padding: '8px 12px' }}
            >
              <option value="ALL">બધી ગાડીઓ ({analyticsData.length})</option>
              {analyticsData.map(c => (
                <option key={c.carId} value={c.carNumber}>{c.carNumber}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Aggregate Totals Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>કુલ ગાડીઓની આવક</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
            {formatINR(totalFleetIncome)}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>કુલ CNG ગેસનો ખર્ચ</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
            {formatINR(totalFleetCNG)}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '4px solid #0ea5e9' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>કુલ સર્વિસ અને રિપેરિંગ</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {formatINR(totalFleetService)}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '4px solid #c084fc' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>અન્ય ખર્ચ (ટોલ/વોશિંગ)</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#c084fc', marginTop: '4px' }}>
            {formatINR(totalFleetOther)}
          </div>
        </div>

        <div className="glass-panel-glow" style={{ padding: '16px 20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ચોખ્ખો ગાડીવાર નફો</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {formatINR(totalFleetProfit)}
          </div>
        </div>
      </div>

      {/* Per-Car Cards List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
          ગાડીઓનો હિસાબ ગણતરી થઈ રહ્યો છે...
        </div>
      ) : displayedCars.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Car size={40} color="#64748b" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>હજુ સુધી કોઈ ગાડી ઉમેરેલ નથી</h3>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>પહેલા 'મારી ગાડીઓ' વિભાગમાં જઈને તમારી ગાડી નંબર રજીસ્ટર કરો.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px' }}>
          {displayedCars.map((car) => {
            const margin = car.income > 0 ? Math.round((car.netProfit / car.income) * 100) : 0;
            return (
              <div 
                key={car.carId} 
                className="glass-panel"
                style={{
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'relative'
                }}
              >
                {/* Car Badge & Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{
                      display: 'inline-block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#fbbf24',
                      background: '#09101d',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      letterSpacing: '1px'
                    }}>
                      {car.carNumber}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600, marginTop: '6px' }}>
                      {car.model}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                      ડ્રાઇવર: <span style={{ color: '#38bdf8' }}>{car.driverName || 'ફાળવેલ નથી'}</span>
                    </div>
                  </div>

                  <span className={`badge ${car.status.includes('ચાલુ') || car.status === 'Active' ? 'badge-active' : 'badge-pending'}`}>
                    {car.status}
                  </span>
                </div>

                {/* Net Profit Big Banner */}
                <div style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: car.netProfit >= 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                  border: car.netProfit >= 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      આ ગાડીનો ચોખ્ખો નફો ({getMonthNameGujarati(selectedMonth)})
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: car.netProfit >= 0 ? '#34d399' : '#f87171' }}>
                      {formatINR(car.netProfit)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>નફાની ટકાવારી</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                      {margin}%
                    </div>
                  </div>
                </div>

                {/* Breakdown Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
                  
                  {/* Monthly Income */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <TrendingUp size={15} /> માસિક ભાડાની આવક
                    </span>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{formatINR(car.income)}</span>
                  </div>

                  {/* Monthly CNG */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Fuel size={15} /> માસિક CNG ગેસનો ખર્ચ
                    </span>
                    <span style={{ fontWeight: 700, color: '#f87171' }}>-{formatINR(car.cngExpense)}</span>
                  </div>

                  {/* Monthly Service */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Wrench size={15} /> માસિક ગાડી સર્વિસ / સ્પેરપાર્ટ
                    </span>
                    <span style={{ fontWeight: 700, color: '#f87171' }}>-{formatINR(car.serviceExpense)}</span>
                  </div>

                  {/* Other Expenses */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <span style={{ color: '#c084fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Receipt size={15} /> અન્ય ખર્ચ (વોશિંગ, ટોલ, પંચર)
                    </span>
                    <span style={{ fontWeight: 700, color: '#f87171' }}>-{formatINR(car.otherExpense)}</span>
                  </div>
                </div>

                {/* Quick Action Button */}
                <button
                  className="btn btn-secondary"
                  style={{ width: '100%', marginTop: '4px', fontSize: '0.825rem' }}
                  onClick={() => onSelectCarForEntry(car.carNumber)}
                >
                  + {car.carNumber} માટે નવી એન્ટ્રી કરો
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
