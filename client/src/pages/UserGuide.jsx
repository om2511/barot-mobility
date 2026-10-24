import React from 'react';
import { 
  Car, 
  Users, 
  Receipt, 
  BarChart3, 
  Banknote, 
  Wallet, 
  ShieldCheck, 
  HelpCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function UserGuide({ setActiveTab }) {
  const steps = [
    {
      step: '૧',
      title: 'પગલું ૧: તમારી ગાડીઓ ઉમેરો',
      tabId: 'cars',
      btnText: 'મારી ગાડીઓ વિભાગમાં જાઓ',
      icon: Car,
      color: '#f59e0b',
      desc: 'સૌ પ્રથમ તમારી પાસે રહેલી બધી ટેક્સી (જેમ કે GJ-18-BB-1001, Maruti Ertiga CNG) ને "મારી ગાડીઓ" વિભાગમાં ઉમેરો.'
    },
    {
      step: '૨',
      title: 'પગલું ૨: ડ્રાઇવરોની નોંધણી કરો',
      tabId: 'drivers',
      btnText: 'મારા ડ્રાઇવરો વિભાગમાં જાઓ',
      icon: Users,
      color: '#38bdf8',
      desc: 'તમારા ડ્રાઇવરનું પૂરું નામ, મોબાઈલ નંબર અને તેમનો નક્કી કરેલ માસિક ફિક્સ પગાર (દા.ત. ₹16,000) દાખલ કરો.'
    },
    {
      step: '૩',
      title: 'પગલું ૩: રોજેરોજની આવક અને ખર્ચ લખો',
      tabId: 'car-entries',
      btnText: 'રોજિંદી એન્ટ્રી વિભાગમાં જાઓ',
      icon: Receipt,
      color: '#10b981',
      desc: 'રોજિંદા ફેરાના ભાડાની આવક, CNG ગેસ પંપના બિલ (પંપના નામ સાથે), ગાડી સર્વિસિંગ બિલ અને ટોલટેક્સ એન્ટ્રી કરો.'
    },
    {
      step: '૪',
      title: 'પગલું ૪: ગાડીવાર ચોખ્ખો નફો જુઓ',
      tabId: 'car-analytics',
      btnText: 'ગાડીવાર હિસાબ જુઓ',
      icon: BarChart3,
      color: '#c084fc',
      desc: 'સોફ્ટવેર આપમેળે દરેક ગાડી નંબર પ્રમાણે: માસિક ભાડું - (CNG ગેસ + સર્વિસ + ટોલ) = ચોખ્ખો નફો ગણીને બતાવશે.'
    },
    {
      step: '૫',
      title: 'પગલું ૫: ડ્રાઇવરનો પગાર હિસાબ કરો',
      tabId: 'salaries',
      btnText: 'ડ્રાઇવર પગાર વિભાગમાં જાઓ',
      icon: Banknote,
      color: '#fbbf24',
      desc: 'મહિને ડ્રાઇવરનું પગાર પત્રક બનાવો. જો ડ્રાઇવરે વચ્ચે ઉપાડ (Advance) લીધો હોય તો તે આપોઆપ બાદ થઈને ચૂકવવાપાત્ર રકમ આવશે.'
    },
    {
      step: '૬',
      title: 'પગલું ૬: હર્ષનો અંગત/ઘર ખર્ચ',
      tabId: 'personal',
      btnText: 'અંગત તિજોરી ખોલો',
      icon: Wallet,
      color: '#34d399',
      desc: 'ટેક્સી બિઝનેસમાંથી ઘર માટે ઉપાડેલા પૈસા, ઘરનું કરિયાણું, ફી, મ્યુચ્યુઅલ ફંડ SIP અને અંગત બચતનો સંપૂર્ણ અલગ હિસાબ રાખો.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(15, 23, 42, 0.9))',
        border: '1px solid rgba(56, 189, 248, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-service">
            <HelpCircle size={14} /> માર્ગદર્શિકા (User Guide)
          </span>
          <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>કલોલ, ગાંધીનગર</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
          સોફ્ટવેર કેવી રીતે વાપરવું?
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginTop: '6px', maxWidth: '750px', lineHeight: 1.6 }}>
          આ સોફ્ટવેર ખાસ હર્ષ ભાઈ બારોટ માટે સરળ ગુજરાતી ભાષામાં બનાવવામાં આવ્યું છે. નીચે આપેલા સરળ પગલાં પ્રમાણે તમે ટેક્સી બિઝનેસ અને ઘરનો તમામ હિસાબ સચોટ રીતે રાખી શકો છો.
        </p>
      </div>

      {/* Security note */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        borderLeft: '4px solid #10b981',
        background: 'rgba(16, 185, 129, 0.08)'
      }}>
        <Lock size={24} color="#10b981" />
        <div>
          <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.92rem' }}>
            એડમિન સુરક્ષા (સિક્યોરિટી)
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            આ સોફ્ટવેર પાસવર્ડથી સુરક્ષિત છે. માત્ર હર્ષ ભાઈ પોતાનું યુઝરનેમ (harsh) અને પાસવર્ડ દાખલ કરીને જ આ તમામ ડેટા જોઈ અને બદલી શકે છે.
          </div>
        </div>
      </div>

      {/* Steps Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px'
      }}>
        {steps.map((st, i) => {
          const Icon = st.icon;
          return (
            <div 
              key={i} 
              className="glass-panel"
              style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: st.color,
                  fontSize: '1.1rem'
                }}>
                  {st.step}
                </div>
                <Icon size={22} color={st.color} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                  {st.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '6px', lineHeight: 1.5 }}>
                  {st.desc}
                </p>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                <button
                  className="btn btn-secondary"
                  style={{ width: '100%', fontSize: '0.82rem' }}
                  onClick={() => setActiveTab(st.tabId)}
                >
                  {st.btnText} &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
