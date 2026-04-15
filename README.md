# 🥗 NutriSense AI

> **The Living Curator of Your Health** — An AI-powered nutrition tracking and analysis platform that treats health data as a premium editorial experience.

![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8.0.4-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2.2-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🆕 Recent Updates (v0.1.0)

- ✅ Enhanced component architecture with full routing implementation
- ✅ Premium navigation UI with top and side navigation bars
- ✅ Material Design icons integration for intuitive interactions
- ✅ Tailwind CSS styling with green & blue botanical theme
- ✅ Responsive desktop-first layout with mobile optimization
- ✅ User profile avatars and notification system UI
- ✅ Improved component state management with React hooks

---

## 📱 Features

✨ **AI-Powered Nutrition Analysis**
- Real-time nutritional insights powered by AI
- Personalized meal recommendations
- Smart dietary suggestions based on your goals

🎯 **Comprehensive Dashboard**
- Daily vitals tracking (calories, macros, micronutrients)
- Visual progress indicators
- Quick meal logging interface
- Notification system with alerts
- User profile management with avatars

📍 **Nearby Healthy Options**
- Discover nearby restaurants and healthy food options
- Location-based recommendations
- Filtered search based on dietary preferences
- Interactive location mapping

👤 **Personalized Profile**
- Custom health goals and preferences
- Dietary restrictions management
- User preference settings
- Profile analytics and history

🎨 **Premium Design System**
- "Living Curator" aesthetic with botanical greens
- Soft minimalism with organic layering
- Glassmorphic AI elements
- Material Design icons for intuitive navigation
- Mobile-first responsive design with desktop optimization

⚡ **High Performance**
- Built with modern React 19 and Vite
- Optimized for fast loading and smooth interactions
- Hot Module Replacement (HMR) for instant updates
- Efficient component re-rendering

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16+)
- **npm** (v8+) or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrigeshkoyande/NutriSense-AI.git
   cd NutriSense-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:5173` with hot module reloading enabled.

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```
NutriSense-AI/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/            # Route pages
│   │   ├── HomeDashboard.jsx        # Main dashboard
│   │   ├── GoalFoodInput.jsx        # Food logging
│   │   ├── NearbyHealthyOptions.jsx # Location-based recommendations
│   │   ├── AiAnalysisResults.jsx    # AI insights
│   │   └── ProfileSettings.jsx      # User profile
│   ├── assets/           # Images and static files
│   ├── App.jsx           # Main app component with routing
│   ├── App.css           # Global styles
│   ├── main.jsx          # Application entry point
│   └── index.css         # Base styles
├── package.json
├── vite.config.js        # Vite configuration
├── eslint.config.js      # ESLint rules
├── design_system.md      # Design system documentation
└── README.md
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19.2.4** | UI framework with hooks |
| **Vite 8.0.4** | Build tool & dev server |
| **Tailwind CSS 4.2.2** | Utility-first styling |
| **React Router 7.14.1** | Client-side routing |
| **React DOM 19.2.4** | React rendering |
| **Material Design Icons** | Icon library for UI |
| **ESLint 9.39.4** | Code linting |
| **PostCSS 8.5.9** | CSS processing |
| **Autoprefixer 10.5.0** | CSS vendor prefixing |

---

## 🎨 Design Philosophy: "The Living Curator"

NutriSense AI transcends traditional health app design with a curated experience:

### Core Principles

- **No Rigid Borders** — Boundaries defined through background shifts and subtle layering
- **Premium Minimalism** — Clean, spacious layouts with high-end aesthetics
- **Smart Hierarchy** — Intentional asymmetry and generous white space
- **Data as Art** — Health metrics presented like editorial content

### Color Palette

- **Primary Green** — `#0d631b` (Vitality & Health)
- **Secondary Blue** — `#007AFF` (AI Intelligence)
- **Tertiary Orange** — `#FF9100` (Smart Insights)
- **Surface White** — `#F5F7F5` (Clean Canvas)

For detailed design guidelines, see [design_system.md](./design_system.md)

---

## 📊 Pages Overview

### 🏠 Home Dashboard
Your daily nutrition hub with premium navigation featuring:
- Top navigation bar with branding and notifications
- Side navigation for quick access to key features
- Calorie intake tracker (e.g., 1200 / 2000)
- Macronutrient breakdown with visual indicators
- User profile section with avatar
- Quick meal logging
- Daily vitals at a glance
- Notification bell and history tracking

### 📝 Goal Food Input
Log meals and set dietary goals with:
- Intuitive meal search interface
- Input portion sizes with visual feedback
- AI-powered nutritional analysis
- Calorie and macro calculations
- Save meal templates for quick logging
- Track dietary goals and restrictions

### 📍 Nearby Healthy Options
Discover healthy dining near you:
- Geolocation-based restaurant finder
- Nutritionally-ranked food options
- Filter by dietary preferences
- Integration with local food databases
- Distance and rating indicators

### 🤖 AI Analysis Results
Intelligent nutritional insights including:
- Personalized dietary recommendations
- Meal optimization suggestions
- Health trend analysis
- AI-powered tips and insights
- Weekly nutrition summary
- Macro distribution charts

### 👤 Profile Settings
Customize your experience with:
- Health goals configuration
- Dietary restrictions and preferences
- Account management
- Notification preferences
- Historical data access
- Export health data

---

## 🔧 Available Scripts

```bash
# Development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint to check code quality
npm run lint
```

---

## 🚀 Deployment

### Build Optimization
The project is configured for optimal production builds:
- **Tree-shaking** enabled
- **CSS splitting** via Tailwind
- **Minification** included
- **Source maps** available for debugging

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

---

## 📝 Available Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomeDashboard | Main nutrition dashboard |
| `/input` | GoalFoodInput | Log meals and set goals |
| `/nearby` | NearbyHealthyOptions | Find healthy dining options |
| `/analysis` | AiAnalysisResults | View AI-powered insights |
| `/profile` | ProfileSettings | Manage user profile |

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_AI_SERVICE_KEY=your_ai_service_key
VITE_LOCATION_API_KEY=your_location_api_key
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** and commit them (`git commit -m 'Add amazing feature'`)
4. **Push to your branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Coding Standards
- Follow the ESLint configuration
- Use meaningful variable and function names
- Keep components modular and reusable
- Write descriptive commit messages
- Test your changes before pushing

---

## 📚 Documentation

- **[Design System](./design_system.md)** — Complete design guidelines and philosophy
- **[Vite Docs](https://vitejs.dev/)** — Build tool documentation
- **[React Docs](https://react.dev/)** — React framework guide
- **[Tailwind CSS](https://tailwindcss.com/)** — Styling documentation

---

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 🐛 Known Issues & Roadmap

### Completed ✅
- [x] UI component architecture
- [x] Navigation system (top & side nav)
- [x] Routing setup
- [x] Design system implementation
- [x] Material Design icons integration
- [x] Responsive layout design

### Coming Soon
- [ ] Backend API integration
- [ ] User authentication (Firebase/Supabase)
- [ ] Real-time database synchronization
- [ ] Food database integration
- [ ] Geolocation API integration
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Meal planning feature
- [ ] Social sharing integration
- [ ] Mobile app (React Native)
- [ ] Offline mode support
- [ ] Image-based food recognition (ML)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

## 👨‍💻 Author

**Mrigesh Koyande**
- GitHub: [@mrigeshkoyande](https://github.com/mrigeshkoyande)
- Email: mrigeshkoyande@gmail.com

---

## 🙏 Acknowledgments

- Inspired by premium health & wellness platforms
- Design system based on "The Living Curator" philosophy
- Built with modern web technologies

---

## 📞 Support & Contact

Have questions or suggestions? 
- Open an [issue](https://github.com/mrigeshkoyande/NutriSense-AI/issues)
- Start a [discussion](https://github.com/mrigeshkoyande/NutriSense-AI/discussions)

---

<div align="center">

**Made with ❤️ for better nutrition and wellness**

[⬆ Back to Top](#-nutrisense-ai)

</div>
