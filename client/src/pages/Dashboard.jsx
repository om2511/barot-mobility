import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Car, 
  Users, 
  Fuel, 
  Wrench, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  IndianRupee,
  Calendar,
  Sparkles,
  Receipt,
  Plus
} from 'lucide-react';
import { formatINR, getMonthNameGujarati } from '../utils/format';

export default function Dashboard({ summary, cars, entries, setActiveTab, onAddEntryClick }) {
  if (!summary) {
    return <div style={{ padding: '40px', color: '#94a3b8', textAlign: 'center' }}>માહિતી લોડ થઈ રહી છે...</div>;
  }

  const kpis = [
    {
      title: 'ટેક્સીની કુલ આવક (આ મહિને)',
      value: formatINR(summary.monthIncome),
      sub: `${entries.filter(e => e.type === 'આવક (ભાડું)').length} ટ્રીપ્સ / ફેરા નોંધાયા`,
      isPos: true,
      icon: TrendingUp,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.12)'
    },
    {
      title: 'કુલ ગાડીઓનો ખર્ચ (આ મહિને)',
      value: formatINR(summary.totalFleetExpense),
      sub: `CNG ગેસ: ${formatINR(summary.monthCng)} | સર્વિસ: ${formatINR(summary.monthService)}`,
      icon: TrendingDown,
      color: '#f43f5e',
      bg: 'rgba(244, 63, 94, 0.12)'
    },
    {
      title: 'ચોખ્ખો બિઝનેસ નફો (આ મહિને)',
      value: formatINR(summary.netBusinessProfit),
      sub: 'ગેસ, સર્વિસ અને પગાર બાદ કર્યા પછી',
      isPos: summary.netBusinessProfit >= 0,
      icon: IndianRupee,
      color: '#fbbf24',
      bg: 'rgba(251, 191, 36, 0.15)',
      glow: true
    },
    {
      title: 'ચાલુ ગાડીઓ અને ડ્રાઇવરો',
      value: `${summary.totalCars} ગાડીઓ / ${summary.activeDrivers} ડ્રાઇવર`,
      sub: 'કલોલ અને ગાંધીનગર નેટવર્ક',
      isPos: true,
      icon: Car,
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.12)'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
        border: '1px solid rgba(245, 158, 11, 0.25)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#fbbf24',
              fontSize: '0.78rem',
              fontWeight: 700
            }}>
              <Sparkles size={13} /> ટેક્સી સંચાલન
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} /> ચાલુ મહિનો: {getMonthNameGujarati(summary.currentMonth)}
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '8px', color: '#fff' }}>
            નમસ્તે, <span className="text-gold">હર્ષ ભાઈ બારોટ</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
            તમારા ટેક્સી બિઝનેસનો આજનો લાઈવ હિસાબ: ગાડીવાર આવક, CNG ગેસ, સર્વિસ, ડ્રાઈવર પગાર અને અંગત ખર્ચ.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary"
            onClick={onAddEntryClick}
          >
            <Plus size={16} /> નવી એન્ટ્રી ઉમેરો (ભાડું/ગેસ/સર્વિસ)
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => setActiveTab('car-analytics')}
          >
            ગાડીવાર હિસાબ જુઓ
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px'
      }}>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx} 
              className={kpi.glow ? 'glass-panel-glow' : 'glass-panel'}
              style={{ padding: '22px 24px', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>
                    {kpi.title}
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginTop: '10px' }}>
                    {kpi.value}
                  </div>
                </div>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: kpi.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={22} color={kpi.color} />
                </div>
              </div>

              <div style={{ marginTop: '14px', fontSize: '0.8rem', color: '#94a3b8' }}>
                {kpi.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Breakdown: Fleet Breakdown & Personal Finance Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        
        {/* Fleet Operating Breakdown */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              આ મહિનાના ખર્ચની વહેંચણી (લાઈવ વિગત)
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>કુલ: {formatINR(summary.totalFleetExpense)}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* CNG Fuel */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Fuel size={15} /> CNG ગેસનો ખર્ચ
                </span>
                <span style={{ fontWeight: 700, color: '#fff' }}>{formatINR(summary.monthCng)}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: summary.totalFleetExpense ? `${Math.round((summary.monthCng / summary.totalFleetExpense) * 100)}%` : '0%', 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' 
                }} />
              </div>
            </div>

            {/* Car Servicing */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wrench size={15} /> ગાડી સર્વિસિંગ અને સ્પેરપાર્ટ ખર્ચ
                </span>
                <span style={{ fontWeight: 700, color: '#fff' }}>{formatINR(summary.monthService)}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: summary.totalFleetExpense ? `${Math.round((summary.monthService / summary.totalFleetExpense) * 100)}%` : '0%', 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #0284c7, #38bdf8)' 
                }} />
              </div>
            </div>

            {/* Driver Salaries */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                <span style={{ color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={15} /> ડ્રાઇવરોને ચુકવેલ પગાર
                </span>
                <span style={{ fontWeight: 700, color: '#fff' }}>{formatINR(summary.monthSalaries)}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: summary.totalFleetExpense ? `${Math.round((summary.monthSalaries / summary.totalFleetExpense) * 100)}%` : '0%', 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #7c3aed, #a855f7)' 
                }} />
              </div>
            </div>

            {/* Other (Tolls, Wash, RTO) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                <span style={{ color: '#ec4899', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Receipt size={15} /> અન્ય ખર્ચ (ટોલટેક્સ, વોશિંગ, પંચર)
                </span>
                <span style={{ fontWeight: 700, color: '#fff' }}>{formatINR(summary.monthOther)}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: summary.totalFleetExpense ? `${Math.round((summary.monthOther / summary.totalFleetExpense) * 100)}%` : '0%', 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #db2777, #f472b6)' 
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Harsh's Personal Finance Snapshot */}
        <div className="glass-panel" style={{
          padding: '24px',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(6, 78, 59, 0.15))'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <span className="badge badge-income" style={{ marginBottom: '6px' }}>ખાનગી હિસાબ</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                હર્ષ ભાઈનો અંગત અને ઘર ખર્ચ
              </h3>
            </div>
            <button 
              className="btn btn-secondary" 
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              onClick={() => setActiveTab('personal')}
            >
              વિગત જુઓ &rarr;
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>કુલ અંગત આવક</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                {formatINR(summary.personalIncome)}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>બિઝનેસ નફો, ભાડું વગેરે</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>કુલ ઘર ખર્ચ</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fda4af', marginTop: '4px' }}>
                {formatINR(summary.personalExpense)}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>કરિયાણું, ફી, દવા, લાઈટબિલ</div>
            </div>
          </div>

          <div style={{
            padding: '14px 18px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#a7f3d0' }}>ચોખ્ખી અંગત બચત (આ મહિને)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                {formatINR(summary.personalSavings)}
              </div>
            </div>
            <Wallet size={28} color="#10b981" />
          </div>
        </div>
      </div>

      {/* Recent Fleet Activity Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              તાજેતરની રોજિંદી એન્ટ્રીઓ
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
              ગાડીના ભાડાની આવક, CNG ગેસના બિલ, સર્વિસિંગ અને અન્ય ખર્ચની યાદી
            </p>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ fontSize: '0.8rem' }}
            onClick={() => setActiveTab('car-entries')}
          >
            બધી એન્ટ્રીઓ જુઓ ({entries.length})
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>તારીખ</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>ગાડી નંબર</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>ડ્રાઇવર</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>પ્રકાર</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>વિગત/કારણ</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>નોંધ</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'right' }}>રકમ</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    હજુ સુધી કોઈ નવી એન્ટ્રી નોંધાયેલ નથી. "+ નવી એન્ટ્રી ઉમેરો" બટન દબાવો.
                  </td>
                </tr>
              ) : (
                entries.slice(0, 6).map((entry) => {
                  const isIncome = entry.type === 'આવક (ભાડું)';
                  return (
                    <tr key={entry.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>{entry.date}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ 
                          fontFamily: 'var(--font-mono)', 
                          padding: '3px 8px', 
                          background: '#09101d', 
                          borderRadius: '6px', 
                          border: '1px solid rgba(255, 255, 255, 0.1)', 
                          color: '#fbbf24', 
                          fontWeight: 700 
                        }}>
                          {entry.carNumber}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#fff' }}>{entry.driverName}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge ${
                          entry.type === 'આવક (ભાડું)' ? 'badge-income' :
                          entry.type === 'CNG ગેસ ખર્ચ' ? 'badge-cng' :
                          entry.type === 'ગાડી સર્વિસ ખર્ચ' ? 'badge-service' : 'badge-other'
                        }`}>
                          {entry.type}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#94a3b8' }}>{entry.category}</td>
                      <td style={{ padding: '12px 14px', color: '#64748b', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {entry.notes || '-'}
                      </td>
                      <td style={{ 
                        padding: '12px 14px', 
                        textAlign: 'right', 
                        fontWeight: 700, 
                        color: isIncome ? '#34d399' : '#f87171',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {isIncome ? `+${formatINR(entry.amount)}` : `-${formatINR(entry.amount)}`}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
