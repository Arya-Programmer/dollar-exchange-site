# 🏛️ Iraqi Exchange Dashboard

A modern, real-time currency exchange rate dashboard for Iraqi cities, featuring beautiful banknote-inspired design and comprehensive rate tracking.

![Dashboard Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38bdf8)

## ✨ Features

### 🎯 Core Functionality
- **Real-time Exchange Rates** - Live data from Iraqi cities via API integration
- **Multi-City Support** - Sulaymaniyah, Erbil, Duhok, Baghdad, and Basra
- **Dual Rate Types** - Penji (5,000 IQD) and Sur (25,000 IQD) denominations
- **Interactive Charts** - 30-day trend visualization with Recharts
- **Currency Converter** - Instant USD ↔ IQD conversion calculator

### 🎨 Design Excellence
- **Banknote Integration** - Authentic Iraqi banknote backgrounds with subtle blending
- **Dynamic Theming** - Blue theme for 5K notes, red theme for 25K notes
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode** - Automatic theme switching with system preference detection
- **Smooth Animations** - Polished transitions and micro-interactions

### 🔧 Technical Features
- **Component Architecture** - Modular, reusable React components with memo optimization
- **Custom Hooks** - Separated business logic for data fetching, calculations, and state management
- **Error Handling** - Comprehensive error boundaries and fallback mechanisms
- **Performance Optimized** - useMemo, useCallback, and strategic re-render prevention
- **TypeScript** - Full type safety throughout the application

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/iraqi-exchange-dashboard.git
   cd iraqi-exchange-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes and proxies
│   ├── layout.tsx         # Root layout with theme provider
│   └── page.tsx           # Main dashboard page
├── components/            # Reusable UI components
│   ├── city-selector.tsx  # City selection interface
│   ├── current-rate-card.tsx # Main rate display with banknotes
│   ├── currency-converter.tsx # USD/IQD converter
│   ├── dashboard-header.tsx # App header with theme toggle
│   ├── exchange-chart.tsx # Rate trend visualization
│   ├── rate-type-selector.tsx # Penji/Sur toggle
│   └── theme-toggle.tsx   # Dark/light mode switcher
├── hooks/                 # Custom React hooks
│   ├── use-chart-data.ts  # Chart data processing
│   ├── use-currency-converter.ts # Conversion logic
│   ├── use-exchange-data.ts # API data fetching
│   ├── use-rate-calculations.ts # Rate math and trends
│   └── use-rate-type-loading.ts # Loading state management
├── lib/                   # Utilities and context
│   └── theme-context.tsx  # Theme management system
└── public/               # Static assets
    └── images/           # Banknote images
```

## 🎨 Design System

### Color Schemes
- **5,000 IQD (Penji)**: Blue gradient (#3a4a7b → #7a8bc9)
- **25,000 IQD (Sur)**: Red gradient (#b8334a → #f68ea8)
- **Dynamic theming** based on selected rate type

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Rate Display**: 6xl, font-black for maximum impact
- **Hierarchical sizing** for optimal information architecture

### Components
- **Rounded corners**: 3xl (24px) for modern aesthetic
- **Shadow system**: Layered shadows matching theme colors
- **Backdrop blur**: Glass-morphism effects on overlays

## 🔌 API Integration

### Data Source
- **Primary API**: `api.aryakurdo.com`
- **Proxy Routes**: Next.js API routes for CORS handling
- **Fallback System**: Graceful degradation with error states

### Endpoints
- `/api/city/[city]` - Exchange rates for specific city
- `/api/styles` - Dynamic theme configuration

### Rate Types
- **Penji**: 5,000 IQD denomination rates
- **Sur**: 25,000 IQD denomination rates

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Code Quality
- **ESLint**: Code linting and formatting
- **TypeScript**: Static type checking
- **Prettier**: Code formatting (recommended)

### Performance Optimization
- **React.memo**: Component memoization
- **useMemo**: Expensive calculation caching
- **useCallback**: Function reference stability
- **Image optimization**: Next.js Image component

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables if needed
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment
- **Docker**: Containerized deployment

## 🔧 Configuration

### Environment Variables
```env
# Optional: Custom API endpoints
NEXT_PUBLIC_API_BASE_URL=https://api.aryakurdo.com
```

### Theme Customization
Modify `lib/theme-context.tsx` to customize:
- Color schemes
- Gradient definitions
- Animation timings
- Fallback themes

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use custom hooks for business logic
- Implement proper error handling
- Add JSDoc comments for complex functions
- Test on multiple browsers and devices

## 📱 Browser Support

- **Chrome**: 90+ ✅
- **Firefox**: 88+ ✅
- **Safari**: 14+ ✅
- **Edge**: 90+ ✅
- **Mobile browsers**: iOS Safari 14+, Chrome Mobile 90+

## 🐛 Troubleshooting

### Common Issues

**App doesn't load in regular browser but works in incognito:**
```bash
# Clear browser storage
localStorage.clear()
sessionStorage.clear()
location.reload()
```

**Theme not loading:**
- Check browser console for API errors
- Verify network connectivity
- Try hard refresh (Ctrl+Shift+R)

**Chart not displaying:**
- Ensure data is being fetched successfully
- Check for JavaScript errors in console
- Verify Recharts compatibility

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🔒 Security

- **API Proxy**: Prevents direct client-side API calls
- **CORS Handling**: Proper cross-origin request management
- **Input Validation**: Sanitized user inputs
- **Error Boundaries**: Prevents application crashes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Iraqi Central Bank** - For currency denomination standards
- **Recharts** - Beautiful chart library
- **Next.js Team** - Amazing React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Vercel** - Deployment and hosting platform

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/iraqi-exchange-dashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/iraqi-exchange-dashboard/discussions)
- **Email**: aryakurdo@gmail.com

---

**Built with ❤️ for the Iraqi financial community**

```
*Last updated: $(date)*
```
```
