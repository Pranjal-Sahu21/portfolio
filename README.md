# 🌟 Portfolio Website

A modern, interactive personal portfolio website built with React and powered by cutting-edge web technologies. Features smooth animations, responsive design, and a beautiful UI to showcase your projects and skills.

![React](https://img.shields.io/badge/-React-blue?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/-Vite-purple?logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

![Preview](https://i.postimg.cc/vB555gWZ/portfolio.png)

---

## ✨ Features

- **📱 Fully Responsive Design** - Optimized for desktop, tablet, and mobile devices with adaptive navigation
- **🎨 Smooth Animations** - Framer Motion animations for engaging scroll effects and transitions
- **🖱️ Custom Cursor** - Interactive custom cursor with hover effects on project cards
- **⚡ Smooth Scrolling** - Lenis integration for butter-smooth scroll experience
- **🎪 Project Showcase** - Carousel-based project display with live links and descriptions:
  - Crexo - An image generation ai saas app
  - Voltmart - Quick-commerce web app
  - ResuScope - AI-powered resume analyzer
  - CheeType - Interactive typing test
  - TasteGPT - Recipe recommendation engine
  - SkyLune - Real-time weather application
- **💼 Skills Section** - Interactive skill showcase with logos for:
  - **Frontend**: HTML, CSS, Tailwind CSS, Vanilla JS, React.js, Framer Motion, React Router
  - **Backend**: Java, Python
  - **Databases**: MySQL, MongoDB
  - **Tools**: Postman
- **📧 Contact Form** - Functional contact form with Formspree integration
- **🎯 Smooth Navigation** - Sticky header with smooth section scrolling
- **🌙 Modern UI** - Clean, professional design with consistent styling

---

## 🛠️ Tech Stack

### Core Framework
- **React** (^19.1.1) - UI library for building interactive interfaces

### Frontend Tools & Libraries
- **Vite** (^7.1.2) - Ultra-fast build tool and dev server
- **Framer Motion** (^12.23.12) - Animation library for smooth transitions
- **Lenis** (^1.3.11) - High-performance smooth scrolling library
- **React Slick** (^0.31.0) - Carousel component for project showcase
- **Lucide React** (^0.562.0) - Minimalist icon library

### Form & Communication
- **@formspree/react** (^3.0.0) - Form backend service

### Development Tools
- **ESLint** (^9.33.0) - Code quality and style enforcement
- **Vite Plugin React** (^5.0.0) - React support for Vite

---

## 📦 Key Dependencies

```json
{
  "@formspree/react": "^3.0.0",
  "framer-motion": "^12.23.12",
  "lenis": "^1.3.11",
  "lucide-react": "^0.562.0",
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-slick": "^0.31.0",
  "slick-carousel": "^1.8.1"
}
```

---

## 📁 Project Structure

```
portfolio-website/
├── assets/                   # Images and static assets
│
├── src/
│   ├── App.jsx              # Main app component
│   ├── Header.jsx           # Navigation header
│   ├── Home.jsx             # Hero section
│   ├── Journey.jsx          # Professional journey section
│   ├── Skills.jsx           # Skills showcase
│   ├── Projects.jsx         # Featured projects carousel
│   ├── Contact.jsx          # Contact form
│   ├── Footer.jsx           # Footer component
│   ├── main.jsx             # React entry point
│   ├── style.css            # Global styles
│   └── Home.css             # Home section styles
│
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint rules
├── package.json             # Project dependencies and scripts
└── README.md                # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-website
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
   ```
   The site will be available at `http://localhost:5173`

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with hot module reloading |
| `npm run build` | Create an optimized production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check code quality |

---

## 🔧 Development

### Key Features Implementation

**Smooth Scrolling**
- Integrated with Lenis for premium scroll experience
- Automatic scroll-to-section navigation

**Animations**
- Framer Motion for scroll-triggered animations
- Custom cursor interactions on hover
- Staggered animations for UI elements

**Responsive Design**
- Mobile-first approach
- Breakpoints optimized for different devices
- Adaptive navigation menu (sidebar on mobile, navbar on desktop)

**Form Integration**
- Formspree backend for contact form submissions
- Success/error state management

---

## 🎨 Customization

### Colors & Typography
Edit `src/style.css` and `src/Home.css` to customize:
- Color schemes
- Font families
- Spacing and sizing

### Projects
Update project data in `src/Projects.jsx`:
```jsx
const projects = [
  {
    title: "Your Project",
    img: projectImage,
    link: "https://your-link.com",
    desc: "Project description"
  },
  // Add more projects...
];
```

### Skills
Modify skills in `src/Skills.jsx`:
```jsx
const allSkills = [
  { name: "Technology Name", img: logoImage },
  // Add more skills...
];
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify (Recommended)
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set build command to `npm run build`
4. Set publish directory to `dist`

### Alternative Hosting
- **Vercel** - Zero-config deployment
- **GitHub Pages** - Free hosting for static sites
- **AWS Amplify** - Full-featured deployment

---

## 📞 Contact & Social

The portfolio includes a functional contact form for direct inquiries. Contact details are integrated through:
- **Formspree** for form submissions

---

## 🛠️ Troubleshooting

### Development server not starting
```bash
npm install
npm run dev
```

### Build errors
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Linting errors
```bash
npm run lint
# Fix automatically fixable issues
npm run lint -- --fix
```

---

**Technologies Used:**
- [React](https://react.dev) - UI library
- [Vite](https://vitejs.dev) - Build tool
- [Framer Motion](https://www.framer.com/motion) - Animation library
- [Lenis](https://lenis.studiofreight.com) - Smooth scrolling
- [Formspree](https://formspree.io) - Form backend

---

