# 🎯 HackPot - Transparent Community Predictions on Algorand

<div align="center">

![HackPot Logo](https://img.shields.io/badge/HackPot-Prediction%20Platform-blueviolet?style=for-the-badge&logo=algorand)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://choosealicense.com/licenses/mit/)
[![Algorand](https://img.shields.io/badge/Built%20on-Algorand-black?style=for-the-badge&logo=algorand)](https://algorand.com)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)

**The most transparent community-driven prediction platform on Algorand blockchain**

[🚀 Live Demo](https://hackpot.xyz) • [📖 Documentation](#documentation) • [🤝 Contributing](#contributing) • [💬 Community](#community)

</div>

## ✨ Overview

HackPot is a revolutionary prediction platform that brings transparency and community-driven decision making to the world of predictions. Built on the Algorand blockchain, it ensures fairness, transparency, and decentralization while providing an engaging user experience.

### 🎯 Key Features

- **🔮 Community Predictions** - Make predictions on various topics and events
- **🏆 Achievement System** - Earn badges and unlock achievements based on your prediction accuracy
- **👥 Referral Program** - Invite friends and earn rewards for growing the community
- **📊 Real-time Analytics** - Track your performance with detailed metrics and insights
- **🎨 Modern UI/UX** - Beautiful, responsive design with dark/light mode support
- **🔐 Secure Wallet Integration** - Support for multiple Algorand wallets (Pera, Defly, Lute, Exodus, WalletConnect)
- **⚡ Fast & Scalable** - Built with modern web technologies for optimal performance

### 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS, Framer Motion
- **Blockchain**: Algorand SDK, AlgoKit Utils
- **Wallet Integration**: TxnLab Use Wallet
- **Backend**: Supabase (Database, Auth, Real-time)
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PNPM (recommended) or npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hackpot-algorand-dapp.git
   cd hackpot-algorand-dapp
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 Features Deep Dive

### 🎮 Game Hub
- Interactive prediction interface
- Real-time updates on prediction status
- Community leaderboards
- Historical prediction tracking

### 👤 User Profiles
- Personalized dashboards
- Prediction history and statistics
- Achievement showcase
- Customizable settings

### 🏅 Achievement System
- Accuracy-based achievements
- Community participation rewards
- Streak bonuses
- Special event badges

### 📈 Analytics & Metrics
- Personal performance tracking
- Community-wide statistics
- Prediction accuracy trends
- Reward distribution analytics

### 🔗 Referral Program
- Unique referral codes
- Multi-tier reward system
- Real-time tracking
- Social sharing integration

## 🏗️ Project Structure

```
hackpot-algorand-dapp/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── achievements/   # Achievement-related components
│   │   ├── admin/         # Admin panel components
│   │   ├── auth/          # Authentication components
│   │   ├── game/          # Game/prediction components
│   │   ├── layout/        # Layout components
│   │   ├── navigation/    # Navigation components
│   │   ├── profile/       # User profile components
│   │   ├── referrals/     # Referral system components
│   │   └── user/          # User management components
│   ├── lib/               # Utility libraries
│   ├── pages/             # Page components
│   ├── stores/            # State management (Zustand)
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Helper functions
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── supabase/              # Database migrations and config
└── ...config files
```

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
```

### Code Quality

This project maintains high code quality standards:

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Tailwind CSS** for consistent styling
- **Component-based architecture** for maintainability

### Testing

```bash
# Run tests (when implemented)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import the project
4. Add environment variables
5. Deploy!

### Manual Deployment

```bash
# Build the project
pnpm build

# Deploy the dist/ folder to your hosting provider
```

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to understand the standards we expect from our community.

## 📖 Documentation

- [API Documentation](docs/API.md)
- [Component Documentation](docs/COMPONENTS.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Architecture Overview](docs/ARCHITECTURE.md)

## 🔒 Security

Security is a top priority for HackPot. Please see our [Security Policy](SECURITY.md) for information about reporting vulnerabilities.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Algorand Foundation](https://algorand.com) for the amazing blockchain technology
- [TxnLab](https://txnlab.dev) for the excellent wallet integration tools
- [Supabase](https://supabase.com) for the backend infrastructure
- [Bolt.new](https://bolt.new) for the development platform
- All our contributors and community members

## 📞 Support & Community

- **Discord**: [Join our community](https://discord.gg/hackpot)
- **Twitter**: [@HackPotAlgorand](https://twitter.com/hackpotalgorand)
- **Email**: support@hackpot.dev
- **Issues**: [GitHub Issues](https://github.com/yourusername/hackpot-algorand-dapp/issues)

---

<div align="center">

**Built with ❤️ by the Julian as HackPot Team**

[⭐ Star us on GitHub](https://github.com/devblac/hackdrop_v0p) • [🐦 Follow on Twitter](https://twitter.com/hackpotalgorand) • [💬 Join Discord](https://discord.gg/hackpot)

</div>
