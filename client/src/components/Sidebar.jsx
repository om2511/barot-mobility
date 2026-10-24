import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Receipt, 
  Car, 
  Users, 
  Banknote, 
  Wallet, 
  UserCircle,
  HelpCircle,
  LogOut,
  MapPin,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'ડેશબોર્ડ', icon: LayoutDashboard },
    { id: 'car-analytics', label: 'ગાડી મુજબ હિસાબ', icon: BarChart3, badge: 'મહત્વનું' },
    { id: 'car-entries', label: 'રોજિંદી એન્ટ્રી', icon: Receipt },
    { id: 'cars', label: 'મારી ગાડીઓ', icon: Car },
    { id: 'drivers', label: 'મારા ડ્રાઇવરો', icon: Users },
    { id: 'salaries', label: 'ડ્રાઇવર પગાર હિસાબ', icon: Banknote },
    { id: 'personal', label: 'હર્ષનો અંગત/ઘર ખર્ચ', icon: Wallet },
    { id: 'profile', label: 'એડમિન પ્રોફાઇલ', icon: UserCircle },
    { id: 'guide', label: 'સોફ્ટવેર માર્ગદર્શિકા', icon: HelpCircle }
  ];

  const handleItemClick = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header Bar (Only visible on Mobile/Tablet) */}
      <header className="mobile-header" style={{
        display: 'none',
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(7, 12, 24, 0.98)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1500
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.svg" alt="Barot Mobility" style={{ width: '32px', height: '32px' }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
              BAROT <span style={{ color: '#fbbf24' }}>MOBILITY</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#10b981' }}>કલોલ, ગાંધીનગર</div>
          </div>
        </div>

        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#fff',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X size={20} color="#fbbf24" /> : <Menu size={20} color="#fff" />}
        </button>
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 1400
          }}
        />
      )}

      {/* Main Sidebar Navigation */}
      <aside 
        className={`app-sidebar ${mobileOpen ? 'mobile-open' : ''}`}
        style={{
          width: '280px',
          minWidth: '280px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          background: 'rgba(7, 12, 24, 0.97)',
          backdropFilter: 'blur(16px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1450,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Brand Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b, #0ea5e9)',
            padding: '2px',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.25)'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: '#070c18',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img src="/logo.svg" alt="Barot Mobility" style={{ width: '36px', height: '36px' }} />
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', letterSpacing: '0.5px' }}>
              BAROT <span style={{ color: '#fbbf24' }}>MOBILITY</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <MapPin size={11} color="#10b981" /> કલોલ, ગાંધીનગર
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div style={{ padding: '14px 10px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', padding: '6px 12px' }}>
            ફ્લીટ મેનેજમેન્ટ
          </div>

          {menuItems.slice(0, 6).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05))' : 'transparent',
                  color: isActive ? '#fbbf24' : '#94a3b8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderLeft: isActive ? '3px solid #f59e0b' : '3px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={18} color={isActive ? '#fbbf24' : '#64748b'} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: '0.62rem',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    fontWeight: 700
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', padding: '12px 12px 4px' }}>
            અંગત &amp; સેટિંગ્સ
          </div>

          {/* Personal Finance */}
          {menuItems.slice(6, 7).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.25), rgba(16, 185, 129, 0.05))' : 'rgba(16, 185, 129, 0.08)',
                  color: isActive ? '#34d399' : '#a7f3d0',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderLeft: isActive ? '3px solid #10b981' : '3px solid rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={18} color={isActive ? '#34d399' : '#10b981'} />
                <span style={{ flex: 1 }}>{item.label}</span>
                <span style={{
                  fontSize: '0.62rem',
                  padding: '2px 5px',
                  borderRadius: '6px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  fontWeight: 700
                }}>
                  ખાનગી
                </span>
              </button>
            );
          })}

          {/* Admin Profile */}
          {menuItems.slice(7, 8).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderLeft: isActive ? '3px solid #38bdf8' : '3px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={18} color={isActive ? '#38bdf8' : '#64748b'} />
                <span style={{ flex: 1 }}>{item.label}</span>
              </button>
            );
          })}

          {/* Guide */}
          {menuItems.slice(8).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: isActive ? '#fff' : '#94a3b8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderLeft: isActive ? '3px solid #fff' : '3px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={18} color={isActive ? '#fff' : '#64748b'} />
                <span style={{ flex: 1 }}>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Admin Profile Footer & Logout */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(5, 8, 17, 0.85)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div 
              onClick={() => handleItemClick('profile')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b, #0ea5e9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#070c18',
                fontSize: '0.85rem'
              }}>
                HB
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#fff' }}>
                  {user?.fullName || 'હર્ષ બારોટ'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <ShieldCheck size={11} /> મુખ્ય એડમિન
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="લોગઆઉટ કરો"
              style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fda4af',
                padding: '7px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        @media (max-width: 900px) {
          .mobile-header {
            display: flex !important;
          }
          .app-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            height: 100vh !important;
            transform: translateX(-100%);
            box-shadow: 10px 0 30px rgba(0,0,0,0.8);
          }
          .app-sidebar.mobile-open {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  );
}
