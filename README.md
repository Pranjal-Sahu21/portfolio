# 🌟 Portfolio Website

A premium, interactive personal portfolio website built with React, styled with Tailwind CSS v4, and powered by modern web technologies. Features a custom animated character cursor avatar, dynamic Canvas-based ASCII art rendering, live API-integrated stats with caching, and a responsive timeline dashboard.

![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white)
![TailwindCSS v4](https://img.shields.io/badge/-TailwindCSS%20v4-38B2AC?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/-Framer%20Motion-FF007F?logo=framer&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## ✨ Key Features

- **👾 Interactive Character Cursor Avatar**: 
  - A custom SVG-designed developer character follows the mouse pointer, walks and rotates dynamically, and squashes on click.
  - Equipped with context-aware dialogue bubbles that deliver humorous developer Easter eggs, timeline commentary, and custom responses when hovering over headers, stats cards, and contact fields. Bypasses click animations on interactive elements.
- **🖼️ Canvas-Based Braille ASCII Art Portrait**:
  - Dynamically draws high-DPI Braille character maps on an HTML5 `<canvas>` container, scaling perfectly as an image (`w-full h-auto`) to bypass browser minimum font size limitations and eliminate mobile horizontal scroll overflow.
  - Dual-themed: renders a sketch-style sketch mapping shadows in Light Mode, and a Floyd-Steinberg dithered detail mapping highlights in Dark Mode.
- **📊 Live API Statistics (GitHub & LeetCode)**:
  - Fetches overall GitHub contributions and LeetCode questions solved from public APIs.
  - Automatically rounds counts down to the nearest hundred (e.g. `800+`, `700+`) and implements local storage caching for 24 hours to prevent API rate-limiting.
- **🛣️ Animated timeline road**:
  - Displays academic milestones along a dashed center-line roadbed that stays light/dark theme-consistent.
  - Features a custom Space Rover vehicle that wiggles on engine start, drives smoothly from the bottom to the top milestone pin upon scroll entrance, and parks cleanly.
- **📱 Fluid Responsiveness & Navigation Drawer**:
  - Optimized for mobile viewports using clamping formulas (`text-[clamp(1.6rem,5.5vw,2.4rem)]` and `gap-[2.2vh]`) to prevent layout overflow in drawer overlays.
  - Replaced dynamic viewport heights (`dvh`/`svh`) with fixed `screen`/`min-h-screen` units to eliminate scroll-triggered page jumps and layout shifts on mobile browsers.
- **🎨 Aesthetic Card Reveals**:
  - Sleek hover animation on Projects cards that smoothly transitions screenshot mockups from grayscale to their original full colors.

---

## 📂 Project Showcase

- **Genixor** — AI-powered custom website generator utilizing prompt-enhancing models.
- **Crexo** — AI image generation SaaS platform with integrated credits and payments.
- **Snip** — Modern URL shortener utilizing Next.js, PostgreSQL, and Drizzle ORM.
- **DevEvent** — Developer event hub for hosting and booking seats.
- **DummiStore** — Free public developer product catalog API.
- **Voltmart** — Quick-commerce client application connected to DummiStore.
- **CheeType** — Interactive typing test measuring speed and accuracy.
- **TasteGPT** — Recipe recommendation engine powered by OpenAI.

---

## 🛠️ Tech Stack & Dependencies

### Core
- **React** (v19.1.1)
- **Vite** (v7.1.2) - Next-generation frontend tooling
- **Tailwind CSS v4** (v4.2.4) - Utility-first styling engine

### Libraries
- **Framer Motion** (v12.23.12) - Advanced layout and spring physics animations
- **Lenis** (v1.3.11) - Fluid smooth scrolling mechanics
- **React Slick** (v0.31.0) - Carousel layout for portfolio showcases
- **React GitHub/Activity Calendar** - Dynamic Git/LeetCode contribution maps
- **Three.js & React Three Fiber** - WebGL integration support

---

## 📁 Folder Structure

```
portfolio-website-main/
├── assets/                    # Text ASCII art assets & images
│   ├── ascii_art_dark.txt     # Braille ASCII art mapping for Dark Mode
│   ├── ascii_art_light.txt    # Braille ASCII art mapping for Light Mode
│   └── Non-ASCII.png          # High-resolution source photo
│
├── public/                    # Sitemap, robots.txt, and static root files
│
├── src/
│   ├── components/            # UI components (Silk background, loader)
│   ├── context/               # React Theme context provider
│   ├── utils/                 # Layout utilities and scroll anchors
│   ├── App.jsx                # Main layout assembly
│   ├── About.jsx              # About me grid, statistics, and canvas ASCII
│   ├── Journey.jsx            # Road-styled vertical timeline section
│   ├── Skills.jsx             # Grid categorized skills dashboard
│   ├── Projects.jsx           # Cards carousel & hover transitions
│   ├── Activity.jsx           # LeetCode/GitHub graphs & cards
│   ├── Contact.jsx            # Formspree email submission page
│   ├── index.css              # Custom Tailwind directives & base styles
│   └── main.jsx               # React virtual DOM bootstrap
│
├── index.html                 # Main entry point & SEO metadata
├── vite.config.js             # Vite configuration
└── package.json               # Package configurations & commands
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager

### Installation & Run

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-website-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production**
   ```bash
   npm run build
   ```
   Deploy the generated `dist` folder to Netlify, Vercel, or AWS Amplify.
