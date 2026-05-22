# BarQR Craft

[中文](./README.zh-CN.md)

A professional QR code & barcode generator / scanner that runs entirely in the browser — no backend required.

## Features

- **QR Code Generation**: Real-time QR codes with adjustable size, foreground, and background colors
- **Barcode Generation**: Supports CODE128, EAN13, CODE39, ITF14, UPC-A, and more
- **Code Scanning**: Upload, drag-and-drop, or paste images to decode QR codes and common barcodes
- **Appearance Customization**: Color pickers, size sliders, barcode line width/height, optional bottom text
- **One-Click Download**: Export codes as PNG images
- **Responsive Layout**: Works well on desktop and mobile
- **Dark Mode**: Follows system theme automatically
- **Bilingual UI**: Switch between 中文 and English; auto-detects browser language on first visit

## Tech Stack

- React 19 + Vite 8 + Tailwind CSS 4
- qrcode.react (QR rendering)
- JsBarcode (barcode rendering)
- jsQR / @zxing/browser (code scanning)
- Pure CSS (CSS variables + Grid/Flex layout)

## Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build (static output to dist/)
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
BarQR-Craft/
├── index.html              # Entry HTML
├── package.json
├── vite.config.js          # Vite config
├── public/                 # Static assets
│   └── favicon.svg
└── src/
    ├── main.jsx            # React entry
    ├── App.jsx             # Root app component
    ├── App.css             # App styles
    ├── pages/              # Pages (QR / Barcode / Scan)
    ├── components/         # Reusable components
    ├── i18n/               # Internationalization (zh / en)
    │   ├── I18nContext.jsx
    │   └── locales/
    │       ├── zh.js
    │       └── en.js
    └── index.css           # Global styles & CSS variables
```

## Browser Compatibility

Latest versions of Chrome, Firefox, Safari, and Edge.

## License

GNU AGPL v3.0 — Free to use, modify, and distribute, but closed-source commercial use is not permitted. See [LICENSE](./LICENSE) for details.
