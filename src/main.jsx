import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { I18nProvider } from './i18n/I18nContext.jsx';
import App from './App.jsx';
import QrPage from './pages/QrPage.jsx';
import BarcodePage from './pages/BarcodePage.jsx';
import ScanPage from './pages/ScanPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Navigate to="/qr" replace />} />
          <Route path="qr" element={<QrPage />} />
          <Route path="barcode" element={<BarcodePage />} />
          <Route path="scan" element={<ScanPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </I18nProvider>
  </StrictMode>,
);
