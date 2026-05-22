import { useState, useRef, useCallback } from 'react';
import BarcodeItem from '../components/BarcodeItem';

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
  { label: '文本', value: 'Hello BarQR' },
  { label: '数字', value: '123456789012' },
  { label: '多行', value: '123456789012\n987654321098\n567890123456' },
];

const FORMATS = ['CODE128', 'EAN13', 'CODE39', 'ITF14', 'UPC'];

export default function BarcodePage() {
  const [inputValue, setInputValue] = useState('123456789012\n987654321098');
  const [foreColor, setForeColor] = useState('#000000');
  const [backColor, setBackColor] = useState('#ffffff');
  const [format, setFormat] = useState('CODE128');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayText, setDisplayText] = useState(true);
  const [textColor, setTextColor] = useState('#000000');
  const [hoverIndex, setHoverIndex] = useState(null);

  const lines = inputValue.split('\n').filter((l) => l.trim());
  const barcodeRefs = useRef({});

  const optionsRef = useRef({});
  optionsRef.current = {
    format, width, height, displayValue: displayText,
    textColor, background: backColor, lineColor: foreColor, fontSize: 14,
  };

  const handleCanvas = useCallback((i, c) => { if (c) barcodeRefs.current[i] = c; else delete barcodeRefs.current[i]; }, []);

  const downloadOne = useCallback((i) => {
    if (barcodeRefs.current[i]) triggerDownload(barcodeRefs.current[i], `barcode-${safeFilename(lines[i], `code-${i + 1}`)}.png`);
  }, [lines]);

  const downloadAll = useCallback(() => {
    let i = 0;
    const next = () => {
      if (i >= lines.length) return;
      if (barcodeRefs.current[i]) triggerDownload(barcodeRefs.current[i], `barcode-${safeFilename(lines[i], `code-${i + 1}`)}.png`);
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
          <label htmlFor="barcode-input" className="font-semibold text-sm" style={{ color: 'var(--text-heading)' }}>
            内容（每行一个码）
          </label>
          <textarea
            id="barcode-input"
            className="content-textarea"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="每行输入一个内容，分别生成独立条形码"
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
          <div className="section-title">条形码设置</div>
          <div className="options-grid">
            <div className="option-row">
              <label htmlFor="bc-format">格式</label>
              <select id="bc-format" value={format} onChange={(e) => setFormat(e.target.value)}>
                {FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="option-row">
              <label htmlFor="bc-width">线宽因子</label>
              <input id="bc-width" type="range" min={1} max={4} step={0.5} value={width}
                     onChange={(e) => setWidth(Number(e.target.value))} />
              <span className="range-value">{width}</span>
            </div>
            <div className="option-row">
              <label htmlFor="bc-height">高度</label>
              <input id="bc-height" type="range" min={40} max={200} step={5} value={height}
                     onChange={(e) => setHeight(Number(e.target.value))} />
              <span className="range-value">{height}px</span>
            </div>
            <div className="checkbox-row">
              <input type="checkbox" id="bc-display-text" checked={displayText}
                     onChange={(e) => setDisplayText(e.target.checked)} />
              <label htmlFor="bc-display-text">显示底部文本</label>
            </div>
            {displayText && (
              <div className="option-row">
                <label htmlFor="bc-text-color">文本颜色</label>
                <input id="bc-text-color" type="color" value={textColor}
                       onChange={(e) => setTextColor(e.target.value)} />
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="section-title">颜色</div>
          <div className="options-grid">
            <div className="color-pair">
              <div className="option-row">
                <label htmlFor="bc-fore">前景色</label>
                <input id="bc-fore" type="color" value={foreColor} onChange={(e) => setForeColor(e.target.value)} />
              </div>
              <div className="option-row">
                <label htmlFor="bc-back">背景色</label>
                <input id="bc-back" type="color" value={backColor} onChange={(e) => setBackColor(e.target.value)} />
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
            <span className="icon">│││</span>
            <p>每行输入一个内容以生成条形码</p>
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
                  <BarcodeItem value={line} index={i} options={optionsRef.current}
                               onCanvasReady={handleCanvas} />
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
