import { useState, useRef, useCallback, useEffect } from 'react';
import jsQR from 'jsqr';
import { BrowserMultiFormatReader } from '@zxing/browser';

function readFileAsImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getImageData(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return { imageData: ctx.getImageData(0, 0, canvas.width, canvas.height), canvas };
}

const BARCODE_FORMATS = [
  'aztec', 'code_128', 'code_39', 'code_93', 'codabar',
  'data_matrix', 'ean_13', 'ean_8', 'itf', 'pdf417',
  'qr_code', 'upc_a', 'upc_e',
];

/* Layer 1: native BarcodeDetector API (Chrome/Edge/Safari) */
async function detectWithNative(img) {
  if (!('BarcodeDetector' in window)) return null;
  try {
    const detector = new BarcodeDetector({ formats: BARCODE_FORMATS });
    const bitmap = await createImageBitmap(img);
    const results = await detector.detect(bitmap);
    bitmap.close();
    return results.length > 0 ? results[0] : null;
  } catch {
    return null;
  }
}

/* Layer 2: jsQR — QR codes */
function detectWithJsQR(img) {
  const { imageData } = getImageData(img);
  return jsQR(imageData.data, imageData.width, imageData.height);
}

/* Layer 3: ZXing — barcodes fallback (Firefox & older browsers) */
async function detectWithZxing(img) {
  try {
    const reader = new BrowserMultiFormatReader();
    const result = await reader.decodeFromImageElement(img);
    if (result) {
      return { content: result.getText(), format: formatLabel(result.getBarcodeFormat()) };
    }
    return null;
  } catch {
    return null;
  }
}

function formatLabel(f) {
  return String(f).replace('_', ' ').toUpperCase();
}

async function decodeImage(img) {
  const native = await detectWithNative(img);
  if (native) {
    return { content: native.rawValue, format: (native.format || '').toUpperCase().replace('_', ' ') };
  }
  const qr = detectWithJsQR(img);
  if (qr) {
    return { content: qr.data, format: 'QR CODE' };
  }
  const zx = await detectWithZxing(img);
  if (zx) {
    return zx;
  }
  return null;
}

export default function ScanPage() {
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = useCallback(async (file) => {
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件（PNG / JPG / WebP 等）');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const img = await readFileAsImage(file);
      setPreview(img.src);
      const decoded = await decodeImage(img);
      if (decoded) {
        setResult(decoded);
      } else {
        setError('未能识别码图内容。请确保图片清晰，码图完整可见。');
      }
    } catch {
      setError('图片读取失败，请重试。');
    } finally {
      setLoading(false);
    }
  }, []);

  const onFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => setDragOver(false), []);

  useEffect(() => {
    const handler = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          processFile(item.getAsFile());
          return;
        }
      }
    };
    document.addEventListener('paste', handler);
    return () => document.removeEventListener('paste', handler);
  }, [processFile]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
      <aside
        className="rounded-2xl p-5 md:p-6 flex flex-col gap-4"
        style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--border)' }}
      >
        <h2 className="font-semibold text-sm" style={{ color: 'var(--text-heading)' }}>上传码图</h2>
        <div
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition ${
            dragOver ? 'border-blue-500 bg-blue-50' : ''
          }`}
          style={{
            borderColor: dragOver ? '#3b82f6' : 'var(--border)',
            background: dragOver ? 'rgba(59,130,246,0.04)' : 'var(--surface-alt)',
          }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="text-3xl opacity-40">📷</span>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>拖拽图片到此处</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>点击选择文件 · 或 Ctrl+V 粘贴</p>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
        {error && <div className="code-item-error">{error}</div>}
        {loading && <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>正在识别...</p>}
      </aside>

      <section
        className="rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center gap-4"
        style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--border)' }}
      >
        {preview ? (
          <>
            <img src={preview} alt="预览" className="max-w-full max-h-64 rounded-lg object-contain"
                 style={{ border: '1px solid var(--border)' }} />
            {result ? (
              <div className="w-full flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                    {result.format}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>识别结果</span>
                </div>
                <div className="w-full p-3 rounded-lg text-sm font-mono break-all"
                     style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', color: 'var(--text-heading)' }}>
                  {result.content}
                </div>
                <button type="button" className="btn-download-all self-center" style={{ marginTop: 0 }}
                        onClick={() => navigator.clipboard.writeText(result.content)}>
                  📋 复制内容
                </button>
              </div>
            ) : !error && !loading ? (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>未能识别码图内容</p>
            ) : null}
          </>
        ) : (
          <div className="preview-placeholder">
            <span className="icon">📷</span>
            <p>上传一张码图进行识别</p>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>支持二维码及常见条形码格式</p>
          </div>
        )}
      </section>
    </div>
  );
}
