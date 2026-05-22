import { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

export default function BarcodeItem({ value, index, options, onCanvasReady }) {
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
      setError(err.message || '生成失败');
      onCanvasReady?.(index, null);
    }
  }, [value, index, options, onCanvasReady]);

  if (error) {
    return <div className="code-item-error">⚠ 第 {index + 1} 行：{error}</div>;
  }
  return <canvas ref={canvasRef} className="preview-canvas" />;
}
