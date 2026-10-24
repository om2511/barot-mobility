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
      {/* Mobile Top Header Bar (Only visible on screens <= 900px) */}
      {!mobileOpen && (<header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.svg" alt="Barot Mobility" style={{ width: '34px', height: '34px' }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff', lineHeight: 1.1 }}>
              BAROT <span style={{ color: '#fbbf24' }}>MOBILITY</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <MapPin size={10} /> કલોલ, ગાંધીનગર
            </div>
          </div>
        </div>

        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
            padding: '8px 10px',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X size={22} color="#fbbf24" /> : <Menu size={22} color="#fff" />}
        </button>
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="mobile-backdrop"
        />
      )}

      {/* Main Sidebar Navigation Drawer */}
      <aside className={`app-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        
        {/* Desktop Brand Header (Hidden on Mobile to prevent double logo/name) */}
        <div className="desktop-brand-header">
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

        {/* Mobile Sidebar Close Button Header (Shown only when Drawer is Open on Mobile) */}
        <div className="mobile-drawer-header">
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '1px' }}>
            મેનુ નેવિગેશન
          </span>
          <button 
            onClick={() => setMobileOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#cbd5e1',
              padding: '6px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Menu Links */}
        <div style={{ padding: '12px 10px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          
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
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05))' : 'transparent',
                  color: isActive ? '#fbbf24' : '#94a3b8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
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

          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', padding: '14px 12px 4px' }}>
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
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.25), rgba(16, 185, 129, 0.05))' : 'rgba(16, 185, 129, 0.08)',
                  color: isActive ? '#34d399' : '#a7f3d0',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '0.9rem',
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
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
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
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: isActive ? '#fff' : '#94a3b8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
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
          padding: '14px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(5, 8, 17, 0.95)'
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
                padding: '7px 9px',
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
        .mobile-header {
          display: none;
        }
        .desktop-brand-header {
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .mobile-drawer-header {
          display: none;
        }

        .app-sidebar {
          width: 280px;
          min-width: 280px;
          height: 100vh;
          position: sticky;
          top: 0;
          background: rgba(7, 12, 24, 0.98);
          backdrop-filter: blur(16px);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          z-index: 1450;
        }

        @media (max-width: 900px) {
          .mobile-header {
            display: flex !important;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: rgba(7, 12, 24, 0.98);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            z-index: 1500;
          }
          
          /* Hide desktop brand logo from sidebar in mobile so it doesn't double */
          .desktop-brand-header {
            display: none !important;
          }

          /* Show clean title & close button inside mobile drawer */
          .mobile-drawer-header {
            display: flex !important;
            align-items: center;
            justify-content: space-between;
            padding: 16px 18px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }

          .mobile-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(4px);
            z-index: 1400;
          }

          .app-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            height: 100vh !important;
            transform: translateX(-100%);
            transition: transform 0.28s ease-in-out;
            box-shadow: 10px 0 30px rgba(0,0,0,0.85);
            z-index: 1600 !important;
          }

          .app-sidebar.mobile-open {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  );
}
