import { useState, useRef, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

function triggerDownload(canvas, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function safeFilename(text, fallback) {
  return text.slice(0, 30).replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '_') || fallback;
}

const SAMPLES = [
  { label: 'URL', value: 'https://example.com' },
  { label: '文本', value: 'Hello, BarQR Craft!' },
  { label: '数字', value: '123456789012' },
  { label: '多行', value: 'https://github.com\nhttps://react.dev\nhttps://vite.dev' },
];

export default function QrPage() {
  const [inputValue, setInputValue] = useState('https://example.com\nhttps://github.com');
  const [qrSize, setQrSize] = useState(256);
  const [foreColor, setForeColor] = useState('#000000');
  const [backColor, setBackColor] = useState('#ffffff');
  const [hoverIndex, setHoverIndex] = useState(null);

  const lines = inputValue.split('\n').filter((l) => l.trim());
  const qrRefs = useRef({});

  const getQrRef = useCallback((i) => (node) => { if (node) qrRefs.current[i] = node; }, []);

  const downloadOne = useCallback((i) => {
    if (qrRefs.current[i]) triggerDownload(qrRefs.current[i], `qr-${safeFilename(lines[i], `code-${i + 1}`)}.png`);
  }, [lines]);

  const downloadAll = useCallback(() => {
    let i = 0;
    const next = () => {
      if (i >= lines.length) return;
      if (qrRefs.current[i]) triggerDownload(qrRefs.current[i], `qr-${safeFilename(lines[i], `code-${i + 1}`)}.png`);
      i++;
      setTimeout(next, 300);
    };
    next();
  }, [lines]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
      {/* Control */}
      <aside
        className="rounded-2xl p-5 md:p-6 flex flex-col gap-5"
        style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--border)' }}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="qr-input" className="font-semibold text-sm" style={{ color: 'var(--text-heading)' }}>
            内容（每行一个码）
          </label>
          <textarea
            id="qr-input"
            className="content-textarea"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="每行输入一个内容，分别生成独立二维码"
            rows={6}
          />
          <div className="flex gap-2 flex-wrap">
            {SAMPLES.map((s) => (
              <button key={s.label} type="button" className="btn-sample" onClick={() => setInputValue(s.value)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="section-title">二维码设置</div>
          <div className="options-grid">
            <div className="option-row">
              <label htmlFor="qr-size">尺寸</label>
              <input id="qr-size" type="range" min={128} max={512} step={8}
                     value={qrSize} onChange={(e) => setQrSize(Number(e.target.value))} />
              <span className="range-value">{qrSize}px</span>
            </div>
          </div>
        </div>

        <div>
          <div className="section-title">颜色</div>
          <div className="options-grid">
            <div className="color-pair">
              <div className="option-row">
                <label htmlFor="qr-fore">前景色</label>
                <input id="qr-fore" type="color" value={foreColor} onChange={(e) => setForeColor(e.target.value)} />
              </div>
              <div className="option-row">
                <label htmlFor="qr-back">背景色</label>
                <input id="qr-back" type="color" value={backColor} onChange={(e) => setBackColor(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Preview */}
      <section
        className="rounded-2xl p-6 md:p-8 flex flex-col items-center overflow-y-auto"
        style={{
          background: 'var(--surface)', boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--border)', maxHeight: 'calc(100vh - 110px)',
        }}
      >
        {lines.length === 0 ? (
          <div className="preview-placeholder">
            <span className="icon">▣</span>
            <p>每行输入一个内容以生成二维码</p>
          </div>
        ) : (
          <>
            <div className={`code-list ${hoverIndex !== null ? 'has-hover' : ''}`}>
              {lines.map((line, i) => (
                <div
                  key={i}
                  className={`code-item ${hoverIndex === i ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <QRCodeCanvas ref={getQrRef(i)} value={line} size={qrSize}
                                bgColor={backColor} fgColor={foreColor} level="H" includeMargin={false} />
                  <div className="code-item-footer">
                    <span className="code-item-label" title={line}>
                      {line.length > 40 ? line.slice(0, 40) + '\u2026' : line}
                    </span>
                    <button type="button" className="btn-download-sm" onClick={() => downloadOne(i)}>
                      ⬇ 下载
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {lines.length > 1 && (
              <button type="button" className="btn-download-all" onClick={downloadAll}>
                ⬇ 下载全部（{lines.length} 个）
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
}
