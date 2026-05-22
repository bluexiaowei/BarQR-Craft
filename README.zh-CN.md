# BarQR Craft

[English](./README.md)

专业二维码 & 条形码生成 / 识别工具，纯浏览器端运行，无需后端服务器。

## 功能

- **二维码生成**：实时生成 QR Code，支持调整尺寸、前景色、背景色
- **条形码生成**：支持 CODE128、EAN13、CODE39、ITF14、UPC-A 等格式
- **码图识别**：上传、拖拽或粘贴图片，识别二维码及常见条形码
- **外观定制**：颜色选择器、尺寸滑块、条形码线宽/高度、底部文本显示
- **一键下载**：将码图导出为 PNG 图片
- **响应式布局**：桌面端和移动端均有良好体验
- **暗色模式**：跟随系统主题自动切换
- **中英双语**：界面支持中文 / English 切换，自动检测浏览器语言

## 技术栈

- React 19 + Vite 8 + Tailwind CSS 4
- qrcode.react（二维码渲染）
- JsBarcode（条形码渲染）
- jsQR / @zxing/browser（码图识别）
- 纯 CSS（CSS 变量 + Grid/Flex 布局）

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本（静态页面输出到 dist/）
npm run build

# 预览构建结果
npm run preview
```

## 项目结构

```
BarQR-Craft/
├── index.html              # 入口 HTML
├── package.json
├── vite.config.js          # Vite 配置
├── public/                 # 静态资源
│   └── favicon.svg
└── src/
    ├── main.jsx            # React 入口
    ├── App.jsx             # 主应用组件
    ├── App.css             # 应用样式
    ├── pages/              # 页面（二维码 / 条形码 / 识别）
    ├── components/         # 可复用组件
    ├── i18n/               # 国际化（中 / 英）
    │   ├── I18nContext.jsx
    │   └── locales/
    │       ├── zh.js
    │       └── en.js
    └── index.css           # 全局样式 & CSS 变量
```

## 浏览器兼容性

Chrome、Firefox、Safari、Edge 最新版。

## 许可

GNU AGPL v3.0 — 允许自由使用、修改和分发，但不允许闭源商业应用。详见 [LICENSE](./LICENSE)。
