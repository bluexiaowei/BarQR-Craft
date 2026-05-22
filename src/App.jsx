import { NavLink, Outlet } from 'react-router-dom';
import './App.css';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold tracking-tight text-white">
              BarQR <span style={{ color: '#60a5fa' }}>Craft</span>
            </span>
            <nav className="flex items-center bg-white/5 rounded-lg p-0.5">
              <NavLink
                to="/qr"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-semibold transition ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`
                }
                style={({ isActive }) => isActive ? { background: '#2563eb' } : {}}
              >
                ▣ 二维码
              </NavLink>
              <NavLink
                to="/barcode"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-semibold transition ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`
                }
                style={({ isActive }) => isActive ? { background: '#2563eb' } : {}}
              >
                │││ 条形码
              </NavLink>
              <NavLink
                to="/scan"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-semibold transition ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`
                }
                style={({ isActive }) => isActive ? { background: '#2563eb' } : {}}
              >
                📷 识别
              </NavLink>
            </nav>
          </div>
          <span
            className="text-xs px-2.5 py-0.5 rounded-full"
            style={{
              background: 'rgba(59,130,246,0.12)',
              color: '#93c5fd',
              border: '1px solid rgba(59,130,246,0.2)',
            }}
          >
            免费
          </span>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 w-full mt-4 pb-8 flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className="border-t py-4 text-center text-xs"
        style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
      >
        <p>BarQR Craft · 一行一码 · 实时生成 · 数据不会离开您的设备</p>
        <p className="mt-1 opacity-60">Built with React + Vite · Free &amp; Open Source</p>
      </footer>
    </div>
  );
}
