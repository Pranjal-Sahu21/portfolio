# 🌟 Premium Interactive Portfolio Website

A premium, highly interactive personal portfolio website built with React, styled with Tailwind CSS v4, and powered by modern web technologies. This site operates exclusively in dark mode with custom brand highlight highlights, featuring a voice-aware chatbot, canvas-based ASCII art, animated custom mascot cursors, and live developer stats dashboards.

![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white)
![TailwindCSS v4](https://img.shields.io/badge/-TailwindCSS%20v4-38B2AC?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/-Framer%20Motion-FF007F?logo=framer&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## ✨ Key Features

- **👾 Interactive Mascot Cursor Avatar**:
  - A custom-designed SVG developer mascot follows the cursor, walks/rotates dynamically, squashes on clicks, and reacts with custom speech bubbles when hovering over headers, skills, and certifications.
  - **Chart Silence**: Speech bubble triggers are automatically bypassed when hovering over Chart.js canvases to keep stats readable.
  - **Easter Egg (Rage Click Disappear)**: Clicking rapidly 5 times in 1 second prompts the mascot to say *"Okay, then I'm leaving"*, freeze in place, and completely disappear until the page is refreshed.
- **🖼️ Canvas-Based Braille ASCII Art Portrait**:
  - Dynamically draws high-DPI Braille character maps on an HTML5 `<canvas>` container in the About section, scaling cleanly to bypass mobile font-scaling limitations and prevent horizontal page shifts.
- **📊 Live API Statistics & Coding Dashboards**:
  - **GitHub Stats**: Dynamically compiles repositories, public counts, followers, stars, pull request creations, and top languages.
  - **GitHub Theme Tabs**: Tab selector buttons for Contributions and Repositories are customized with the official brand-green GitHub theme (`#2ea44f`).
  - **LeetCode Stats**: Displays global rank, beats-meter, reputation, points, and badges. Includes a circular solved questions beats progress bar styled in LeetCode orange (`#ffa116`) with bypassed grayscale filters.
  - **Heatmap Calendars**: Both GitHub and LeetCode activity grids are aligned under the GitHub Green contribution calendar theme.
- **🎓 Vertical Space-Rover Timeline (Journey)**:
  - Renders academic timelines (SAI, Vikash, and NIT Rourkela B.Tech CSE) along a center-line roadbed. A custom Space Rover vehicle wiggles on engine start and drives smoothly to the current milestone pin on scroll.
- **📜 Velocity Marquee Row (Licenses & Certifications)**:
  - Displays six credentials (GFG, Udemy, HackerRank, Simplilearn) on a single scroll-velocity-based marquee row. Includes large full image previews displaying in original colors by default and clean, styled issuer brand badges.
- **💻 Desktop Coverflow Swiper (Featured Projects)**:
  - Showcases projects inside a Coverflow Swiper container. Inactive slides have their built-in Swiper darkening shadows disabled and display screenshots in original colors. A clean CSS `shadow-md` drop shadow applies conditionally only to the active card.
- **✉️ Glassmorphic Contact Section**:
  - Styled contact details (Email, Phone, Location) and submission forms inside glassmorphic panel cards featuring solid green left borders (`border-l-[#2ea44f]`) and custom hover states. Migrated to EmailJS for secure email deliveries.
- **💬 Puter GPT-4o-Mini Mascot Chatbot**:
  - A persistent floating Mascot AI representative. It is fully synchronized with Pranjal's LaTeX resume, grades, Nit Rourkela CSE status, certifications (with Google Drive preview links), and live coding activity details.
- **🌙 Forced Dark-Only Layout & Light Loader**:
  - Fully operates under dark mode guidelines (no toggles in headers/dock). Operates a custom initial loading transition screen styled in light mode colors (white background, dark text/mascot) to prevent dark screen flashes.

---

## 📂 Project Showcase

- **Zynero** — Real-time workspace project management platform utilizing Next.js, PostgreSQL, Prisma, Clerk, Inngest webhook background workers, and Redux Toolkit/Chart.js analytics.
- **Genixor** — AI-powered custom website builder SaaS utilizing prompt-enhancing models and Stripe payments.
- **Crexo** — AI image generation platform powered by Clipdrop AI with credit-based Razorpay checkouts.
- **Snip** — Modern, containerized URL shortener utilizing Next.js, PostgreSQL, Drizzle ORM, and Docker Compose.
- **DevEvent** — Developer event hub for booking hybrid event seats with MongoDB compound index protection.
- **DummiStore** — Free public developer product catalog API.
- **Voltmart** — Quick-commerce client application connected to DummiStore.
- **CheeType** — Interactive typing test measuring speed and accuracy.
- **TasteGPT** — Recipe recommendation engine powered by OpenAI.

---

## 🛠️ Tech Stack & Dependencies

### Core
- **React** (v19.1.1)
- **Vite** (v7.1.2) - Next-generation dev server and bundler
- **Tailwind CSS v4** (v4.2.4) - Utility-first styling engine

### Libraries
- **Framer Motion** (v12.23.12) - Advanced layout animations and physics
- **Lenis** (v1.3.11) - Fluid smooth scrolling mechanics
- **Chart.js & React Chartjs 2** - Dynamic Pie and Line data visualizations
- **Swiper** (v12.2.0) - Swiper slide touch carousels
- **React GitHub/Activity Calendar** - Git & LeetCode contribution grids
- **@emailjs/browser** (v4.4.1) - Client-side email dispatching
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
│   ├── components/            # UI components (ChatBot, scroll-based-velocity)
│   │   ├── ui/
│   │   │   ├── scroll-based-velocity.jsx
│   │   │   └── StylishCarousel.jsx
│   │   └── ChatBot.jsx
│   │
│   ├── context/               # React Theme context provider (forced dark)
│   ├── utils/                 # Layout utilities and scroll anchors
│   ├── App.jsx                # Main layout assembly & custom cursor logic
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
   git clone https://github.com/Pranjal-Sahu21/portfolio
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
