# Ayush Yadav - Portfolio

A modern, interactive portfolio website featuring a holographic bento dashboard design with glassmorphism effects, smooth GSAP animations, and 60fps performance.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4?style=flat-square&logo=tailwindcss)
![GSAP](https://img.shields.io/badge/GSAP-3-88ce02?style=flat-square&logo=greensock)

## Features

- **Holographic Bento Dashboard** - Glassmorphism cards with 3D tilt effects
- **60fps Animations** - GSAP-powered scroll and hover animations
- **Smooth Scrolling** - Lenis for butter-smooth scroll experience
- **Dark Mode First** - Beautiful dark theme with light mode toggle
- **Accessible** - WCAG AA compliant with reduced motion support
- **Responsive** - Mobile-first design that works on all devices
- **SEO Optimized** - Next.js SSR with full meta tags

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Animation** | GSAP, Framer Motion, Lenis |
| **UI Components** | Radix UI, Lucide Icons |
| **Deployment** | Vercel |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/yadava5/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── layout/             # Header, Footer, Cursor
│   ├── sections/           # Hero, About, Projects, etc.
│   ├── ui/                 # Reusable UI components
│   └── effects/            # Animation components
├── hooks/                  # Custom React hooks
└── lib/
    ├── data/               # Project, experience, skills data
    └── utils.ts            # Utility functions
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript type check |

## Design System

### Colors

- **Background**: Deep dark (#030014)
- **Accent Primary**: Purple (#8b5cf6)
- **Accent Secondary**: Cyan (#06b6d4)
- **Accent Tertiary**: Pink (#f472b6)

### Effects

- **Glassmorphism**: `backdrop-filter: blur(12px)` with subtle borders
- **Holographic**: Animated rainbow gradients with hue-rotate
- **3D Tilt**: CSS perspective transforms on hover

## Performance

- 60fps scroll and hover animations (GSAP)
- Code-split routes for fast initial load
- Optimized images with Next.js Image
- Reduced motion support for accessibility

## Accessibility

- Semantic HTML throughout
- Keyboard navigation support
- Screen reader friendly
- Color contrast > 4.5:1 (WCAG AA)
- `prefers-reduced-motion` respected

## Author

**Ayush Yadav**  
CS @ Miami University '26 | Data Engineer & Full-Stack Developer

- [GitHub](https://github.com/yadava5)
- [LinkedIn](https://www.linkedin.com/in/ayush-yadav-developer/)
- [Email](mailto:aesh_1055@icloud.com)

## License

MIT © 2026 Ayush Yadav
