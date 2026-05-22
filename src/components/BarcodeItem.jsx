import { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { useI18n } from '../i18n/I18nContext.jsx';

export default function BarcodeItem({ value, index, options, onCanvasReady }) {
  const { t } = useI18n();
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!value.trim()) return;
    try {
      JsBarcode(canvasRef.current, value, options);
      setError(null);
      onCanvasReady?.(index, canvasRef.current);
    } catch (err) {
      setError(err.message || t('barcode.generateFailed'));
      onCanvasReady?.(index, null);
    }
  }, [value, index, options, onCanvasReady, t]);

  if (error) {
    return (
      <div className="code-item-error">
        ⚠ {t('barcode.lineError', { line: index + 1, error })}
      </div>
    );
  }
  return <canvas ref={canvasRef} className="preview-canvas" />;
}
