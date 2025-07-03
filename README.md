# Iraqi Exchange Rates Dashboard 🇮🇶💱

A beautiful, modern web application for tracking real-time Iraqi Dinar (IQD) exchange rates across major Iraqi cities. Built with Next.js 15, TypeScript, and a custom theming system.

![Dashboard Preview](https://via.placeholder.com/800x400/0060df/ffffff?text=Iraqi+Exchange+Dashboard)

## ✨ Features

- 🌍 **Multi-City Support**: Track rates for Sulaymaniyah, Erbil, Duhok, Baghdad, and Basra
- 🎨 **Dynamic Theming**: Custom light/dark themes fetched from API
- 📊 **Interactive Charts**: Beautiful area charts showing rate trends
- 💱 **Currency Converter**: Real-time USD ↔ IQD conversion
- 📱 **Responsive Design**: Perfect on desktop, tablet, and mobile
- 🔄 **Auto-Refresh**: Real-time data updates
- 🎯 **Modern UI**: Glassmorphism, smooth animations, and beautiful gradients

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git** for cloning the repository

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

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

That's it! The dashboard should now be running locally. 🎉

## 📁 Project Structure

```
iraqi-exchange-dashboard/
├── app/
│   ├── api/
│   │   └── city/
│   │       └── [city]/
│   │           └── route.ts          # API proxy for CORS handling
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout with theme provider
│   └── page.tsx                      # Main page component
├── components/
│   └── theme-toggle.tsx              # Theme switcher component
├── lib/
│   └── theme-context.tsx             # Theme management and API integration
├── exchange-dashboard.tsx            # Main dashboard component
├── package.json                      # Dependencies and scripts
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # This file
```

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env.local` file in the root directory if you need to configure any environment variables:

```env
# Optional: Add any custom configuration here
NEXT_PUBLIC_API_BASE_URL=https://api.aryakurdo.com
```

### API Endpoints

The application uses the following APIs:

1. **Exchange Rate Data**: `https://api.aryakurdo.com/api/city/{cityName}`
2. **Theme Colors**: `https://aryakurdo.com/api/styles`

## 🎨 Theming System

The dashboard features a sophisticated theming system that:

- Fetches color schemes from the remote API
- Supports both light and dark themes
- Persists user theme preference in localStorage
- Automatically detects system theme preference
- Applies colors using CSS custom properties

### Theme Structure

Each theme contains the following color properties:

```typescript
interface ThemeColors {
  background: string          // Main background color
  backgroundAlt: string       // Alternative background
  backgroundElevated: string  // Elevated surfaces
  border: string             // Border colors
  card: string               // Card backgrounds
  primary: string            // Primary brand color
  primaryHover: string       // Primary hover state
  text: string               // Primary text color
  textMuted: string          // Muted text color
  textDimmed: string         // Dimmed text color
  // ... and more
}
```

## 📊 Data Flow

1. **City Selection**: User selects a city from the dropdown
2. **API Request**: Frontend calls `/api/city/[cityName]` (Next.js API route)
3. **Proxy Request**: API route fetches data from external API to avoid CORS
4. **Data Processing**: Exchange rate data is processed and formatted
5. **UI Update**: Charts, current rate, and converter are updated
6. **Theme Application**: Colors are applied via CSS custom properties

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

### Adding New Cities

To add support for new cities:

1. Update the `cities` array in `exchange-dashboard.tsx`:
   ```typescript
   const cities = [
     // ... existing cities
     { 
       value: "newCityArabic", 
       label: "newCityArabic", 
       english: "New City English", 
       flag: "🏛️" 
     },
   ]
   ```

2. Ensure the API endpoint supports the new city name

### Customizing the UI

The dashboard uses a combination of:
- **Tailwind CSS** for utility classes
- **CSS Custom Properties** for dynamic theming
- **Inline styles** for theme-dependent colors

To customize colors, modify the theme data returned by the API or update the fallback colors in `theme-context.tsx`.

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - The app includes a Next.js API proxy to handle CORS
   - If you still see CORS errors, check that the API routes are working

2. **Theme Not Loading**
   - Check browser console for API errors
   - Verify the theme API endpoint is accessible
   - Fallback colors will be used if API fails

3. **Chart Not Displaying**
   - Ensure exchange rate data is being fetched successfully
   - Check browser console for JavaScript errors
   - Verify the data format matches the expected structure

4. **Build Errors**
   - Run `npm run type-check` to identify TypeScript issues
   - Ensure all dependencies are installed correctly

### Debug Mode

To enable debug logging, add this to your browser console:
```javascript
localStorage.setItem('debug', 'true')
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy with default settings

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- **Netlify**: Use the Next.js build command
- **Railway**: Connect your GitHub repository
- **DigitalOcean App Platform**: Use the Next.js template

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Exchange rate data provided by [AryaKurdo API](https://api.aryakurdo.com)
- Built with [Next.js](https://nextjs.org/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons from [Lucide React](https://lucide.dev/)

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/your-username/iraqi-exchange-dashboard/issues)
3. Create a new issue with detailed information

---

**Made with ❤️ for the Iraqi community**

*Happy coding! 🚀*
```

This comprehensive README covers everything needed to run the project locally, including:

- **Quick start guide** with step-by-step instructions
- **Project structure** explanation
- **Configuration options** and environment variables
- **Theming system** details
- **Development workflow** and available scripts
- **Troubleshooting guide** for common issues
- **Deployment instructions** for various platforms
- **Contributing guidelines** for future developers

The README is structured to be beginner-friendly while providing enough technical detail for experienced developers. It includes all the necessary commands and explanations to get the dashboard running on any laptop! 🚀
