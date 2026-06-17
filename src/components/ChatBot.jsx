import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, RefreshCw } from "lucide-react";
const parseBoldText = (text) => {
  if (typeof text !== "string") return text;
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  boldRegex.lastIndex = 0;
  while ((match = boldRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    const boldContent = match[1];

    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    parts.push(
      <strong key={matchIndex} className="font-bold text-light-text dark:text-white">
        {boldContent}
      </strong>
    );

    lastIndex = boldRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

const parseMessageText = (text) => {
  if (!text) return "";
  const unionRegex = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))|(https?:\/\/[^\s)]+)/gi;
  const parts = [];
  let lastIndex = 0;
  let match;

  unionRegex.lastIndex = 0;
  while ((match = unionRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    const matchStr = match[0];

    if (matchIndex > lastIndex) {
      const plainText = text.substring(lastIndex, matchIndex);
      const boldProcessed = parseBoldText(plainText);
      if (Array.isArray(boldProcessed)) {
        parts.push(...boldProcessed);
      } else {
        parts.push(boldProcessed);
      }
    }

    if (match[1]) {
      const linkText = match[2];
      const linkUrl = match[3];
      parts.push(
        <a
          key={matchIndex}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline font-medium hover:opacity-80 transition-opacity duration-200"
        >
          {parseBoldText(linkText)}
        </a>
      );
    } else {
      let linkUrl = matchStr;
      let suffix = "";
      const trailingPunctuationMatch = linkUrl.match(/[.,;:?!)]+$/);
      if (trailingPunctuationMatch) {
        const punctuation = trailingPunctuationMatch[0];
        linkUrl = linkUrl.substring(0, linkUrl.length - punctuation.length);
        suffix = punctuation;
      }
      parts.push(
        <a
          key={matchIndex}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline font-medium hover:opacity-80 transition-opacity duration-200"
        >
          {linkUrl}
        </a>
      );
      if (suffix) {
        parts.push(suffix);
      }
    }
    lastIndex = unionRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    const plainText = text.substring(lastIndex);
    const boldProcessed = parseBoldText(plainText);
    if (Array.isArray(boldProcessed)) {
      parts.push(...boldProcessed);
    } else {
      parts.push(boldProcessed);
    }
  }

  return parts.length > 0 ? parts : text;
};
const getLanguagesString = (githubState) => {
  if (!githubState || !githubState.languages) return "JavaScript, HTML, CSS, Java";
  if (typeof githubState.languages === "string") return githubState.languages;
  if (Array.isArray(githubState.languages)) {
    return githubState.languages
      .map(lang => `${lang.name} (${parseFloat(lang.percentage).toFixed(1)}%)`)
      .join(", ");
  }
  return "JavaScript, HTML, CSS, Java";
};

const PUTER_AUTH_TOKEN = import.meta.env.VITE_PUTER_AUTH_TOKEN;

export default function ChatBot() {
  useEffect(() => {
    if (PUTER_AUTH_TOKEN && !localStorage.getItem("puter.auth.token")) {
      localStorage.setItem("puter.auth.token", PUTER_AUTH_TOKEN);
    }
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I am Pranjal's AI assistant. Feel free to ask me anything about his projects, technical skills, NIT Rourkela education, or coding achievements.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  
  const [stats, setStats] = useState({
    github: {
      publicRepos: 22,
      followers: 5,
      totalStars: 10,
      prsCount: 12,
      languages: "JavaScript, HTML, CSS, Java",
    },
    leetcode: {
      totalSolved: 773,
      easySolved: 303,
      mediumSolved: 432,
      hardSolved: 38,
      totalQuestions: 3962,
      ranking: 68867,
      contestRating: 1810,
      contestTopPercentage: 1.5,
      reputation: 26,
      points: 3021,
      badges: 5,
    }
  });

  useEffect(() => {
    let active = true;
    const fetchStats = async () => {
      const cachedLeetcode = localStorage.getItem("leetcode_stats_cache_v5");
      
      let githubData = null;
      let leetcodeData = null;
      
      if (cachedLeetcode) {
        try {
          const parsed = JSON.parse(cachedLeetcode);
          if (Date.now() - parsed.timestamp < 86400000) {
            leetcodeData = parsed.data;
          }
        } catch {}
      }
      
      try {
        const headers = { Accept: "application/vnd.github.v3+json" };
        const results = await Promise.allSettled([
          fetch("https://api.github.com/users/pranjal-sahu21", { headers }),
          fetch("https://api.github.com/users/pranjal-sahu21/repos?per_page=100", { headers }),
          fetch("https://api.github.com/search/issues?q=author:pranjal-sahu21+type:pr", { headers }),
        ]);
        
        const profileRes = results[0].status === "fulfilled" ? results[0].value : null;
        const reposRes = results[1].status === "fulfilled" ? results[1].value : null;
        const prsRes = results[2].status === "fulfilled" ? results[2].value : null;
        
        let profile = {};
        if (profileRes && profileRes.ok) profile = await profileRes.json();
        
        let repos = [];
        if (reposRes && reposRes.ok) repos = await reposRes.json();
        
        let prs = {};
        if (prsRes && prsRes.ok) prs = await prsRes.json();
        
        let totalStars = 0;
        const langCounts = {};
        let totalReposWithLang = 0;
        if (Array.isArray(repos)) {
          repos.forEach((repo) => {
            totalStars += repo.stargazers_count || 0;
            if (repo.language) {
              langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
              totalReposWithLang++;
            }
          });
        }

        const sortedLanguages = Object.entries(langCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => {
            const pct = totalReposWithLang > 0 ? ((count / totalReposWithLang) * 100).toFixed(1) : 0;
            return `${name} (${pct}%)`;
          })
          .slice(0, 5)
          .join(", ");
        
        githubData = {
          publicRepos: profile.public_repos || (Array.isArray(repos) ? repos.length : 22),
          followers: profile.followers || 5,
          totalStars: totalStars || 10,
          prsCount: prs.total_count || 12,
          languages: sortedLanguages || "JavaScript, HTML, CSS, Java",
        };
      } catch (e) {
        console.error("ChatBot GitHub fetch error:", e);
      }
      
      if (!leetcodeData) {
        try {
          const mainRes = await fetch("https://leetcode-api-faisalshohag.vercel.app/Pranjal_1619");
          let mainData = null;
          if (mainRes.ok) mainData = await mainRes.json();
          
          let contestData = null;
          try {
            const contestRes = await fetch("https://alfa-leetcode-api.onrender.com/userContestRankingInfo/Pranjal_1619");
            if (contestRes.ok) contestData = await contestRes.json();
          } catch {}
          
          let badgesData = null;
          try {
            const badgesRes = await fetch("https://alfa-leetcode-api.onrender.com/Pranjal_1619/badges");
            if (badgesRes.ok) badgesData = await badgesRes.json();
          } catch {}
          
          if (mainData) {
            leetcodeData = {
              totalSolved: mainData.totalSolved || 773,
              easySolved: mainData.easySolved || 303,
              mediumSolved: mainData.mediumSolved || 432,
              hardSolved: mainData.hardSolved || 38,
              totalQuestions: mainData.totalQuestions || 3962,
              ranking: mainData.ranking || 68867,
              contestRating: contestData && contestData.userContestRanking ? Math.round(contestData.userContestRanking.rating) : 1810,
              contestTopPercentage: contestData && contestData.userContestRanking ? contestData.userContestRanking.topPercentage : 1.5,
              reputation: mainData.reputation || 26,
              points: mainData.contributionPoint || 3021,
              badges: badgesData ? badgesData.badgesCount : 5,
            };
            localStorage.setItem("leetcode_stats_cache_v5", JSON.stringify({ data: leetcodeData, timestamp: Date.now() }));
          }
        } catch (e) {
          console.error("ChatBot LeetCode fetch error:", e);
        }
      }
      
      if (active) {
        setStats((prev) => ({
          github: githubData || prev.github,
          leetcode: leetcodeData || prev.leetcode,
        }));
      }
    };
    
    fetchStats();
    return () => {
      active = false;
    };
  }, []);
  
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Alert new messages when chatbot is closed
  useEffect(() => {
    if (messages.length > 1 && !isOpen) {
      setHasNewMessage(true);
    }
  }, [messages, isOpen]);

  const handleOpenToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        sender: "bot",
        text: "Conversation reset! What would you like to know about Pranjal next?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    // Add user message
    const userMsg = {
      sender: "user",
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    try {
      // Calculate current date and time dynamically
      const currentDateText = new Date().toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const currentTimeText = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      });

      // Build API message history
      const systemPrompt = `You are "Pranjal's AI Bot", a professional, polite, and helpful AI representative on Pranjal Sahu's personal portfolio website.
Here is your complete and detailed knowledge base about Pranjal Sahu, derived from his professional LaTeX resume, dashboard stats, and profiles. Use this information to answer any questions visitors have about him:

- **Current Date**: ${currentDateText}
- **Current Time**: ${currentTimeText}

## Contact & Links:
- **Email**: sahupranjal1619@gmail.com
- **Phone**: +91 88955 96189
- **Location**: Rourkela, Sundergarh, Odisha, India
- **LinkedIn**: https://www.linkedin.com/in/pranjal-sahu-/
- **GitHub**: https://github.com/Pranjal-Sahu21
- **Instagram**: https://www.instagram.com/prsahu_21/
- **LeetCode**: https://leetcode.com/u/Pranjal_1619
- **Portfolio Website**: https://portfoliopranjalsahu.netlify.app
- **Resume/CV**: Available for download via [Google Drive](https://drive.google.com/file/d/1tKWvaG2YOVkODYJuIEg1eZFmE3GWVSCk/view?usp=drive_link).

## About Pranjal Sahu
- **Age**: Born in 2006 (currently 20 years old).
- **Current Role**: Web Developer & Computer Science and Engineering (CSE) B.Tech Student at the National Institute of Technology (NIT), Rourkela (2024 - Present).

## Education & Grades:
- **NIT Rourkela (August 2024 - Present)**: B.Tech in Computer Science & Engineering. Current CGPA: 8.61. Location: Rourkela, Odisha.
- **SAI International School, Bhubaneswar (May 2024)**: AISSCE - CBSE, Science (PCM). Grade: 92.2%. Location: Bhubaneswar, Odisha.
- **Vikash Convent School, Karanjia (May 2022)**: CISCE - ICSE. Grade: 96.2%. Location: Karanjia, Odisha.

## Relevant Coursework:
- Data Structures and Algorithm
- Database Management
- Object Oriented Programming
- Design and Analysis of Algorithms
- Operating System
- Computer Networks

## Coding Achievements & Live Stats:
- **Projects completed**: 15+ featured and utility projects.
- **GitHub Contributions**: 800+ contributions.
- **GitHub Repositories**: Over 30+ repositories (from which ${stats.github.publicRepos} are public).
- **GitHub Followers**: ${stats.github.followers} followers.
- **GitHub Total Stars**: ${stats.github.totalStars} stars earned.
- **GitHub Pull Requests**: ${stats.github.prsCount} PRs merged/created.
- **GitHub Top Languages**: ${getLanguagesString(stats.github)}.
- **LeetCode Username**: @Pranjal_1619
- **LeetCode Solved**: Solved ${stats.leetcode.totalSolved} questions out of ${stats.leetcode.totalQuestions} total questions (${stats.leetcode.easySolved} Easy, ${stats.leetcode.mediumSolved} Medium, and ${stats.leetcode.hardSolved} Hard).
- **LeetCode Ranking**: Global rank is #${stats.leetcode.ranking.toLocaleString()} (beats 99.8% of users).
- **LeetCode Contest Rating**: Contest Rating of ${stats.leetcode.contestRating} (which is over 1800).
- **LeetCode Reputation**: ${stats.leetcode.reputation} reputation points.
- **LeetCode Points**: ${stats.leetcode.points} contribution points.
- **LeetCode Badges**: ${stats.leetcode.badges} badges earned.

## Professional Certifications:
- **HackerRank React Developer Certification** (May 2026): Validated proficiency in 3 frontend technologies: React, JavaScript, and CSS. View [HackerRank Certificate](https://drive.google.com/file/d/1B_VNAmS_5NawDiHcQus9MqH4Mu9RFziI/view?usp=sharing).
- **GeeksforGeeks MongoDB Architecture Certification** (April 2026): Covered 4 MongoDB concepts: data modeling, indexing, replication, and sharding. View [GFG MongoDB Certificate](https://drive.google.com/file/d/1-_KRuUd5orE4Qv5zhPW9IL7RuWSzPZpc/view?usp=sharing).

## Technical Skills:
- **Languages**: Java, JavaScript, TypeScript, Python, C
- **Web**: HTML5, CSS3, Tailwind CSS, React.js, Next.js, Node.js, Express.js
- **Databases**: PostgreSQL, MongoDB, MySQL
- **Developer Tools**: Git, Netlify, Vercel, Render, Postman, Mongoose, Prisma, Drizzle, Docker

## Projects & Technical Details:
- **Genixor – AI Website Builder SaaS** (March 2026):
  - **Description**: Engineered an AI-powered SaaS platform capable of generating complete websites from natural language prompts with real-time preview and editing.
  - **Key Features**: Designed modular frontend architecture using React + TypeScript, creating 10+ reusable components for scalable project management. Implemented subscription billing using Stripe (supporting 3 pricing plans and secure payment workflows) and 4+ core features (project management, publishing, code export, live preview).
  - **Tech Stack**: React, Node.js, PostgreSQL, Prisma, Stripe, Step 3.5 Model.
  - **Links**: [GitHub Repository](https://github.com/Pranjal-Sahu21/ai-website-builder-saas) | [Live Demo](https://genixor.netlify.app)
- **DevEvent – Developer Event Platform** (May 2026):
  - **Description**: Architected a full-stack event platform supporting 3 event modes (online, offline, hybrid) for discovering and publishing developer events.
  - **Key Features**: Established secure RSVP workflows with MongoDB compound indexes, enforcing 1 registration per email per event to prevent duplicate bookings. Constructed organizer tools integrating Cloudinary media uploads and management of 10+ event attributes (agendas, venues, tags, schedules). Leveraged PostHog analytics to deliver 5+ core features (discovery, booking, publishing, search, recommendations).
  - **Tech Stack**: Next.js, MongoDB, Mongoose, PostHog, Cloudinary.
  - **Links**: [GitHub Repository](https://github.com/Pranjal-Sahu21/nextjs-project) | [Live Demo](https://dev-events-bay.vercel.app)
- **Snip – URL Shortener Service** (May 2026):
  - **Description**: Created a secure URL shortening platform supporting custom aliases and complete link lifecycle management.
  - **Key Features**: Implemented JWT authentication and developed 4 RESTful API endpoints for creating, retrieving, updating, and deleting shortened URLs. Modeled relational schemas using PostgreSQL and Drizzle ORM for 2 core entities (users and URLs). Containerized with Docker Compose using a 2-service architecture (Next.js + PostgreSQL) with automated schema synchronization.
  - **Tech Stack**: Next.js, PostgreSQL, Drizzle, JWT, Docker.
  - **Links**: [GitHub Repository](https://github.com/Pranjal-Sahu21/url-shortener-service) | [Live Demo](https://snip-xi.vercel.app)
- **Crexo** (Completed in February 2026): AI image generation platform powered by Clipdrop AI, with integrated Razorpay payments for credit-based generation. Tech stack: React.js, Node.js, Express.js, MongoDB, Clipdrop API, Razorpay. [Live Demo](https://crexo.netlify.app)
- **DummiStore** (Completed in March 2026): Free product API with endpoints for all products, categories, and single items. Tech stack: React.js, Node.js, Express.js, RESTful API, express-rate-limiter. [Live Demo](https://dummistore.netlify.app)
- **Voltmart** (Completed in December 2025): A quick-commerce web app (using DummiStore API) with persistent storage. Tech stack: React.js, TailwindCSS, Context API, localStorage. [Live Demo](https://voltmart.netlify.app)
- **CheeType** (Completed in September 2025): An interactive typing test tracking speed/accuracy. Tech stack: React.js, CSS3. [Live Demo](https://cheetype.netlify.app)
- **TasteGPT** (Completed in August 2025): Ingredient-based recipe recommender. Tech stack: React.js, CSS3, Spoonacular API. [Live Demo](https://tastegpt.netlify.app)

## Technology Stack Project Mapping Rules:
- If asked in which projects you used **PostgreSQL**, answer: **Genixor, Snip**.
- If asked in which projects you used **MongoDB**, answer: **Crexo, DevEvent**.
- If asked in which projects you used **React.js / React**, state that it is used in **all projects** (Genixor, Crexo, Snip, DevEvent, DummiStore, Voltmart, CheeType, TasteGPT).

Personality guidelines:
- Maintain a polite, professional, and respectful tone at all times. Act as a high-quality AI representative for Pranjal Sahu.
- Speak clearly, helpfully, and concisely (strictly 1-3 sentences maximum). Do not use any emojis in your responses. Emojis are strictly forbidden. Avoid casual slang or overly informal phrases.
- Present all educational details, grades, and tech skills objectively and in a positive light.
- If a visitor asks about hiring or contacting Pranjal, provide his contact details (email: sahupranjal1619@gmail.com, phone: +91 88955 96189) professionally.`;

      const apiHistory = [
        { role: "system", content: systemPrompt }
      ];

      // Format previous 10 messages for context window
      const sliceStart = Math.max(0, messages.length - 10);
      messages.slice(sliceStart).forEach((m) => {
        apiHistory.push({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text
        });
      });

      apiHistory.push({ role: "user", content: trimmed });

      let botReply = "Oops! My communication systems are offline right now. You can reach Pranjal directly at sahupranjal1619@gmail.com.";

      if (window.puter && window.puter.ai) {
        const response = await window.puter.ai.chat(apiHistory, {
          model: "gpt-4o-mini"
        });
        if (response && response.message && response.message.content) {
          botReply = response.message.content.trim();
        } else if (typeof response === "string") {
          botReply = response.trim();
        }
      } else {
        // Fallback mock response for local testing or when Puter fails
        await new Promise((resolve) => setTimeout(resolve, 1000));
        botReply = "Hi! I would love to answer that, but my AI connection is currently initialization-pending. Please feel free to check out Pranjal's GitHub or email him directly!";
      }

      const botMsg = {
        sender: "bot",
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);



    } catch (err) {
      console.error("ChatBot error:", err);
      const errorMsg = {
        sender: "bot",
        text: "I hit a glitch in my processors. Please ask me again or drop Pranjal a message via the contact form.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* 1. FLOATING ACTION BUTTON */}
      <div className={`fixed bottom-6 right-6 z-[9600] flex items-center justify-center ${isOpen ? "hidden md:flex" : "flex"}`}>
        <button
          onClick={handleOpenToggle}
          className="w-14 h-14 rounded-full bg-primary text-bg flex items-center justify-center shadow-2xl hover:scale-108 active:scale-95 transition-all duration-300 border border-primary/20 relative group overflow-hidden"
          aria-label="Toggle chatbot"
          data-hover-text={isOpen ? "Close AI chat" : "Talk to my AI bot!"}
        >
          {/* Pulsing online status indicator / Unread indicator */}
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-bg shadow-[0_0_6px_#22c55e]">
            {hasNewMessage && (
              <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
            )}
          </span>

          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
          ) : (
            <Bot className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-0.5 animate-bounce-gentle" />
          )}
        </button>
      </div>

      {/* 2. CHAT PANEL WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-0 md:bottom-24 right-0 md:right-6 w-full md:w-[360px] max-w-full md:max-w-[calc(100vw-32px)] h-[100dvh] md:h-[480px] bg-card-bg/95 md:bg-card-bg/85 backdrop-blur-xl border-none md:border md:border-primary/10 rounded-none md:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[9800] origin-bottom-right"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            {/* Header */}
            <div className="p-4 pt-[calc(1rem+env(safe-area-inset-top))] md:pt-4 bg-primary text-bg flex items-center justify-between border-b border-primary/10 select-none">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-bg text-primary flex items-center justify-center relative">
                  <Bot className="w-5 h-5" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-syne font-bold text-sm leading-none flex items-center gap-1.5">
                    Mascot Bot
                  </h3>
                  <span className="text-[10px] opacity-75 font-space font-medium tracking-wide">
                    Online & Ready
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg hover:bg-bg/15 text-bg transition-colors duration-200 cursor-pointer"
                  title="Reset Conversation"
                  data-hover-text="Reset conversation"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-bg/15 text-bg transition-colors duration-200 cursor-pointer"
                  aria-label="Close chat"
                  data-hover-text="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message History */}
            <div 
              data-lenis-prevent
              className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col max-w-[80%] ${
                    m.sender === "user" ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <div
                    className={`px-3.5 py-2.5 text-[0.9rem] leading-relaxed font-space ${
                      m.sender === "user"
                        ? "bg-primary text-bg rounded-2xl rounded-tr-xs"
                        : "bg-input-bg text-light-text border border-primary/5 rounded-2xl rounded-tl-xs"
                    }`}
                  >
                    {parseMessageText(m.text)}
                  </div>
                  <span className="text-[9px] text-muted-text/80 mt-1 px-1 font-space">
                    {m.time}
                  </span>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex flex-col items-start max-w-[80%] self-start">
                  <div className="px-4 py-3 bg-input-bg text-light-text border border-primary/5 rounded-2xl rounded-tl-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-muted-text rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-muted-text rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-muted-text rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSend}
              className="p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:pb-3 bg-card-bg border-t border-primary/10 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask about my skills or projects..."
                className="flex-1 bg-input-bg/75 border border-primary/10 rounded-xl px-4 py-2 text-sm text-light-text placeholder:text-muted-text focus:outline-none focus:border-primary/30 transition-all font-space"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                className="p-2.5 bg-primary text-bg rounded-xl hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
