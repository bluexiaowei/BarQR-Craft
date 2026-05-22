import { NavLink, Outlet } from 'react-router-dom';
import { useI18n } from './i18n/I18nContext.jsx';
import './App.css';

export default function App() {
  const { locale, setLocale, t } = useI18n();

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
                ▣ {t('nav.qr')}
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
                │││ {t('nav.barcode')}
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
                📷 {t('nav.scan')}
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center rounded-lg p-0.5 text-xs font-semibold"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <button
                type="button"
                onClick={() => setLocale('zh')}
                className="px-2 py-0.5 rounded-md transition"
                style={{
                  background: locale === 'zh' ? 'rgba(59,130,246,0.35)' : 'transparent',
                  color: locale === 'zh' ? '#fff' : '#94a3b8',
                }}
              >
                中
              </button>
              <button
                type="button"
                onClick={() => setLocale('en')}
                className="px-2 py-0.5 rounded-md transition"
                style={{
                  background: locale === 'en' ? 'rgba(59,130,246,0.35)' : 'transparent',
                  color: locale === 'en' ? '#fff' : '#94a3b8',
                }}
              >
                EN
              </button>
            </div>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full"
              style={{
                background: 'rgba(59,130,246,0.12)',
                color: '#93c5fd',
                border: '1px solid rgba(59,130,246,0.2)',
              }}
            >
              {t('nav.free')}
            </span>
          </div>
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
        <p>{t('footer.tagline')}</p>
        <p className="mt-1 opacity-60">{t('footer.builtWith')}</p>
      </footer>
    </div>
  );
}
