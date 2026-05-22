以下是根据您的需求（二维码与条形码生成网站，React.js）编写的 **AI 开发计划文档**。该文档可供 AI 或开发团队直接参考，分阶段实现功能。

---

# 项目开发计划：BarQR Craft

## 1. 项目概述

**项目名称**：BarQR Craft  
**项目类型**：单页 Web 应用（SPA）  
**核心功能**：  
- 生成二维码（QR Code）  
- 生成条形码（Barcode，支持多种编码格式）  
- 实时自定义外观（颜色、尺寸、文本显示等）  
- 下载生成的码图为 PNG 图片  

**目标用户**：需要快速生成可定制化二维码/条形码的任何人（营销人员、开发者、普通用户）。  
**技术约束**：完全在浏览器端运行，不依赖后端服务器，保证数据隐私。

---

## 2. 功能需求清单

### 2.1 必须实现（P0）
| 编号 | 功能                       | 描述                                                                 |
|------|----------------------------|----------------------------------------------------------------------|
| F1   | 内容输入                   | 支持文本、URL、数字等任意字符串输入，使用 `<textarea>` 组件            |
| F2   | 二维码生成                 | 实时根据输入内容生成 QR Code，支持调整尺寸、前景色、背景色             |
| F3   | 条形码生成                 | 支持至少 3 种常用条形码格式（CODE128、EAN13、CODE39），可实时切换      |
| F4   | 码类型切换（二维码/条形码） | 单选切换预览区域对应的码图类型                                         |
| F5   | 下载功能                   | 将当前显示的码图（Canvas）导出为 PNG 文件                              |
| F6   | 外观实时调节               | 颜色选择器、尺寸滑块、条形码高度/宽度因子、是否显示底部文本等           |
| F7   | 错误提示                   | 内容为空或格式错误时给出友好提示                                        |

### 2.2 建议实现（P1）
| 编号 | 功能                     | 描述                                                     |
|------|--------------------------|----------------------------------------------------------|
| F8   | 示例填充按钮             | 一键填充示例内容，方便用户快速体验                         |
| F9   | 条形码文本颜色自定义     | 如果显示底部文字，可自定义文字颜色                         |
| F10  | 响应式布局               | 在移动端和桌面端均有良好显示效果                           |
| F11  | 二维码纠错级别           | 让用户选择纠错级别（L / M / Q / H），默认为 H              |

### 2.3 未来扩展（P2）
| 编号 | 功能                   | 描述                                                 |
|------|------------------------|------------------------------------------------------|
| F12  | 历史记录/收藏           | 存储最近生成的 10 条内容                              |
| F13  | 批量生成（CSV 导入）    | 上传 CSV 文件批量生成多个码图并打包下载                |

---

## 3. 技术栈选型

| 类型         | 技术选型                     | 理由                                                                 |
|--------------|------------------------------|----------------------------------------------------------------------|
| UI 框架      | React 18 (或 19)             | 组件化开发，状态管理简单，符合题目要求                                 |
| 构建工具     | Vite 或 Create React App     | 快速启动，开发体验好                                                  |
| 二维码库     | `qrcode.react`               | 专为 React 设计，支持自定义大小、颜色，直接输出 Canvas                 |
| 条形码库     | `jsbarcode`                  | 成熟稳定，支持多种条码格式，纯 Canvas 渲染                             |
| 样式方案     | 纯 CSS + CSS 变量            | 轻量，无需额外依赖；也可选用 Tailwind CSS 提高开发效率                  |
| 状态管理     | React useState / useReducer  | 功能不复杂，局部状态足够                                                |
| 存储（可选） | localStorage                 | 用于未来扩展（历史记录）                                               |

---

## 4. 页面布局与组件设计

### 4.1 页面结构（线框图）

```
+-------------------------------------------+
|                 Header                     |
|  BarQR Craft · 专业二维码&条形码生成器      |
+-------------------+-----------------------+
| 控制面板          | 预览面板               |
| - 内容输入框       |                       |
| - 码类型切换       |    [ 码图显示区域 ]     |
| - 二维码特有参数   |                       |
| - 条形码特有参数   |                       |
| - 颜色选择器       |                       |
| - 错误提示         |   [ 下载按钮 ]         |
+-------------------+-----------------------+
|                 Footer                     |
|  实时生成 · 本地处理                         |
+-------------------------------------------+
```

### 4.2 组件树

```
BarQRApp (根组件)
├── Header
├── ControlPanel
│   ├── InputSection (textarea + 示例按钮)
│   ├── CodeTypeSelector (radio group)
│   ├── QrOptions (条件渲染)
│   │   ├── SizeSlider
│   │   └── (可选) ErrorLevelSelect
│   ├── BarcodeOptions (条件渲染)
│   │   ├── FormatSelect
│   │   ├── WidthSlider
│   │   ├── HeightSlider
│   │   ├── DisplayTextCheckbox
│   │   └── TextColorPicker
│   └── ColorOptions (前景色/背景色)
├── PreviewPanel
│   ├── QrCodeDisplay (使用 qrcode.react)
│   ├── BarcodeDisplay (使用 canvas + jsbarcode)
│   └── DownloadButton
└── Footer
```

### 4.3 关键状态设计（State）

```javascript
const [inputValue, setInputValue] = useState('https://example.com');
const [codeType, setCodeType] = useState('qr');        // 'qr' or 'barcode'
const [qrSize, setQrSize] = useState(250);
const [foreColor, setForeColor] = useState('#000000');
const [backColor, setBackColor] = useState('#ffffff');
const [barcodeFormat, setBarcodeFormat] = useState('CODE128');
const [barcodeWidth, setBarcodeWidth] = useState(2);
const [barcodeHeight, setBarcodeHeight] = useState(100);
const [displayText, setDisplayText] = useState(true);
const [textColor, setTextColor] = useState('#000000');
const [errorMsg, setErrorMsg] = useState('');
```

---

## 5. 实现步骤（分阶段）

### Phase 0：项目初始化
1. 使用 Vite 创建 React 项目：`npm create vite@latest barqr-craft -- --template react`
2. 安装依赖：`npm install qrcode.react jsbarcode`
3. 清理默认代码，创建 `src/components` 目录。

### Phase 1：静态结构与基础状态
- 搭建 `App.jsx` 主结构，划分左右区域。
- 定义上述所有 state（初始值合理）。
- 实现无逻辑的静态样式（CSS Grid / Flex）。

### Phase 2：二维码功能
- 引入 `QRCode` 组件，绑定 `value`、`size`、`bgColor`、`fgColor`。
- 监听 `inputValue` 变化，自动重新渲染二维码。
- 添加尺寸滑块控制 `qrSize`，颜色选择器控制 `foreColor` / `backColor`。
- 实现二维码的下载功能：获取 `QRCode` 组件内部的 canvas 元素（通过 ref），调用 `toDataURL` 并下载。

### Phase 3：条形码功能
- 创建 `<canvas ref={barcodeCanvasRef}>` 用于绘制条形码。
- 编写 `drawBarcode` 函数，使用 `JsBarcode` 库，参数绑定到 state。
- 在条形码参数变化、`inputValue` 变化时调用 `drawBarcode`。
- 实现 `barcodeFormat` 切换，支持 CODE128、EAN13、CODE39、ITF14、UPC。
- 实现条形码宽度因子、高度、文本显示选项。
- 条形码下载时直接使用 canvas ref。

### Phase 4：码类型切换与统一 UI
- 添加 `codeType` 单选按钮，条件渲染不同的选项面板。
- 根据 `codeType` 在预览区域显示 `QRCode` 组件或 `<canvas>`。
- 确保切换时下载按钮能获取正确的 canvas 元素（使用 ref 或 state 存储 canvas 实例）。

### Phase 5：增强用户体验
- 添加“填充示例”按钮，将 `inputValue` 设置为预设的 URL 或文本。
- 添加错误处理：若输入为空，显示错误提示；条形码生成失败时捕获异常并提示。
- 优化移动端布局（响应式）。

### Phase 6：测试与优化
- 测试特殊字符、长文本、emoji 在二维码中的表现。
- 测试条形码不同格式对输入内容的限制（例如 EAN13 需要 12-13 位数字）。
- 调整样式，增加动画/边框圆角等视觉细节。

---

## 6. 样式设计指引

### 6.1 设计风格
- **现代轻量化**：大量圆角、柔和阴影、白色背景。
- **主色**：深蓝灰（`#1e293b`）用于标题，强调色为青绿（`#0d9488`）。
- **字体**：系统默认无衬线字体（Inter, system-ui）。

### 6.2 核心 CSS 类（示例）

```css
.app-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: 'Inter', system-ui;
}
.main-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.control-panel {
  background: #f8fafc;
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.preview-panel {
  background: white;
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.btn-download {
  background: #0d9488;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  cursor: pointer;
  margin-top: 1.5rem;
}
/* 响应式 */
@media (max-width: 720px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}
```

### 6.3 颜色选择器样式
- 使用原生 `<input type="color">`，简单可靠。
- 前景色/背景色各占一行，或并排显示。

---

## 7. 关键代码片段参考

### 7.1 二维码使用示例

```jsx
import QRCode from 'qrcode.react';

<QRCode
  value={inputValue || ' '}
  size={qrSize}
  bgColor={backColor}
  fgColor={foreColor}
  level="H"
  includeMargin={false}
/>
```

### 7.2 条形码绘制示例

```jsx
import JsBarcode from 'jsbarcode';

const canvasRef = useRef(null);

useEffect(() => {
  if (canvasRef.current && codeType === 'barcode') {
    JsBarcode(canvasRef.current, inputValue, {
      format: barcodeFormat,
      width: barcodeWidth,
      height: barcodeHeight,
      displayValue: displayText,
      textColor: textColor,
      background: backColor,
      lineColor: foreColor,
    });
  }
}, [inputValue, barcodeFormat, barcodeWidth, barcodeHeight, displayText, textColor, foreColor, backColor]);
```

### 7.3 下载函数

```jsx
const downloadCanvas = (canvas, filename) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};
```

---

## 8. 风险与应对

| 风险                           | 应对措施                                                         |
|--------------------------------|------------------------------------------------------------------|
| 条形码库对某些输入内容不支持   | 捕获 `JsBarcode` 异常，显示明确错误信息，并建议用户更换格式       |
| 二维码内容过长导致难以扫描     | 不主动限制，但在界面上增加提示：“长文本可能使二维码过于密集”        |
| 下载时获取不到 canvas 元素     | 使用 `useRef` 配合 `useEffect` 确保元素已渲染，并设置状态标志       |
| 移动端页面布局混乱             | 使用 CSS Grid + 媒体查询，并将预览区域置于控制面板之上（移动端）  |

---

## 9. 交付物清单

- 完整的 React 项目源码（符合上述设计）
- 运行说明（`README.md`）：
  - 安装依赖：`npm install`
  - 开发模式：`npm run dev`
  - 构建生产版本：`npm run build`
- 浏览器兼容性：Chrome, Firefox, Safari, Edge 最新版

---

## 10. 开发工期估算

| 阶段         | 预估工时 | 说明                               |
|--------------|----------|------------------------------------|
| 初始化 + 静态布局 | 1h   | 搭建项目结构、CSS Grid 布局          |
| 二维码功能    | 1.5h     | 集成 qrcode.react，下载，滑块控制    |
| 条形码功能    | 2h       | 集成 JsBarcode，多种参数，条件渲染    |
| 切换逻辑与统一 | 1h       | codeType 切换，选项面板隐藏/显示      |
| 样式打磨 + 响应式 | 1.5h   | 圆角、阴影、移动端适配                 |
| 测试 + 文档   | 1h       | 边界测试，README 编写                 |
| **总计**      | **8 小时** | 约 1 个工作日（单人开发）             |

