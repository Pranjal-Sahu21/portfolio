import { motion, useInView as realUseInView } from "framer-motion";
const useInView = () => true;
import { useRef, useState, useEffect } from "react";
import StickyTitle from "./components/StickyTitle";
import { GitHubCalendar } from "react-github-calendar";
import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "./context/ThemeContext";
import { useStats } from "./context/StatsContext";

import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Filler 
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Filler
);

function CountUp({ value, duration = 1.5, inView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) {
      setCount(0);
      return;
    }

    const end = parseInt(value, 10);
    if (isNaN(end) || end === 0) {
      setCount(0);
      return;
    }

    const totalMiliseconds = duration * 1000;
    const startTime = performance.now();

    let animationFrameId;

    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime >= totalMiliseconds) {
        setCount(end);
      } else {
        const progress = elapsedTime / totalMiliseconds;
        const easeOutProgress = progress * (2 - progress); // Ease out quadratic
        const currentCount = Math.floor(easeOutProgress * end);
        setCount(currentCount);
        animationFrameId = requestAnimationFrame(updateCount);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration, inView]);

  return <span>{count.toLocaleString()}</span>;
}

export default function Activity() {
  const { theme } = useTheme();
  const [activeGithubTab, setActiveGithubTab] = useState("contributions");

  const githubRef = useRef(null);
  const githubInView = useInView(githubRef, { once: true, amount: 0.3 });

  const leetcodeRef = useRef(null);
  const leetcodeInView = useInView(leetcodeRef, { once: true, amount: 0.3 });

  // Calendar themes
  const githubCalendarTheme = {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  };

  const languageColors = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572a5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    Shell: "#89e051",
    Jupyter: "#da5b0b",
    Rust: "#dea584",
    Go: "#00add8",
    Ruby: "#701516",
    PHP: "#4f5d95",
    Swift: "#f05138",
    Kotlin: "#A97BFF",
    Other: "#888888"
  };



  // --- SHARE CODING STATS VIA CONTEXT ---
  const {
    githubStats,
    githubLoading,
    githubError,
    leetcodeData,
    leetcodeCalendar,
    leetcodeContest,
    leetcodeBadges,
    leetcodeLoading: loading,
    leetcodeError: error,
  } = useStats();


  // LeetCode Pie Chart Data and Options
  const leetcodeChartData = leetcodeData ? {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [
      {
        data: [
          leetcodeData.easySolved || 0,
          leetcodeData.mediumSolved || 0,
          leetcodeData.hardSolved || 0,
        ],
        backgroundColor: ["#00b8a3", "#ffc01e", "#ef4743"],
        borderColor: theme === "dark" ? "#181818" : "#ffffff",
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  } : null;

  const leetcodeChartOptions = leetcodeData ? {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 8,
    },
    animation: {
      duration: 1500,
      animateRotate: true,
      animateScale: true,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: theme === "dark" ? "#181818" : "#ffffff",
        titleColor: theme === "dark" ? "#ffffff" : "#000000",
        bodyColor: theme === "dark" ? "#cccccc" : "#666666",
        borderColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        titleFont: {
          family: "Space Grotesk",
          size: 13,
          weight: "bold",
        },
        bodyFont: {
          family: "Space Grotesk",
          size: 11,
        },
        padding: 6,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            let totalForDiff = 0;
            if (label === "Easy") totalForDiff = leetcodeData.totalEasy || 0;
            else if (label === "Medium") totalForDiff = leetcodeData.totalMedium || 0;
            else if (label === "Hard") totalForDiff = leetcodeData.totalHard || 0;

            const percent = totalForDiff > 0 ? (value / totalForDiff) * 100 : 0;
            return ` ${label}: ${value}/${totalForDiff} (${percent.toFixed(1)}%)`;
          },
        },
      },
    },
  } : null;

  const renderCircularProgress = (solved, total) => {
    const radius = 68;
    const circumference = 2 * Math.PI * radius;
    const percentage = total > 0 ? (solved / total) * 100 : 0;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div 
        className="relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center flex-shrink-0"
        data-hover-text="That's a lot of questions. I should probably touch some grass."
      >
        <svg
          className="w-full h-full transform -rotate-90 grayscale-0!"
          viewBox="0 0 160 160"
        >
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-[#ffa116]/10"
          />
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={leetcodeInView ? { strokeDashoffset: strokeDashoffset } : { strokeDashoffset: circumference }}
            strokeLinecap="round"
            className="text-[#ffa116]"
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute text-center flex flex-col justify-center items-center pointer-events-none">
          <span className="text-3xl sm:text-4xl font-bold font-syne text-primary leading-none">
            {solved.toLocaleString()}
          </span>
          <span className="block text-[0.7rem] sm:text-xs text-muted-text font-space uppercase tracking-wider mt-1.5">
            / {total}
          </span>
          <span className="block text-[9px] sm:text-[10px] text-neutral-500 dark:text-neutral-400 font-space font-medium mt-1 leading-none">
            beats 99.9%
          </span>
        </div>
      </div>
    );
  };
  // GitHub Languages Pie Chart Data and Options
  const githubChartData = githubStats ? {
    labels: githubStats.languages.map((l) => l.name),
    datasets: [
      {
        data: githubStats.languages.map((l) => l.count),
        backgroundColor: githubStats.languages.map((l) => languageColors[l.name] || "#888888"),
        borderColor: theme === "dark" ? "#181818" : "#ffffff",
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  } : null;

  const githubChartOptions = githubStats ? {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 8,
    },
    animation: {
      duration: 1500,
      animateRotate: true,
      animateScale: true,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: theme === "dark" ? "#181818" : "#ffffff",
        titleColor: theme === "dark" ? "#ffffff" : "#000000",
        bodyColor: theme === "dark" ? "#cccccc" : "#666666",
        borderColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        titleFont: {
          family: "Space Grotesk",
          size: 13,
          weight: "bold",
        },
        bodyFont: {
          family: "Space Grotesk",
          size: 11,
        },
        padding: 6,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const lang = githubStats.languages[index];
            return ` ${lang.count} ${lang.count === 1 ? "repo" : "repos"} (${lang.percentage.toFixed(1)}%)`;
          },
        },
      },
    },
  } : null;

  // GitHub Repositories Growth History Line Chart Config
  const githubLineChartData = githubStats && githubStats.repoHistoryLabels ? {
    labels: githubStats.repoHistoryLabels,
    datasets: [
      {
        label: "Total Repositories",
        data: githubStats.repoHistoryData,
        borderColor: "#2ea44f",
        backgroundColor: "rgba(46, 164, 79, 0.05)",
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: "#2ea44f",
        pointBorderColor: theme === "dark" ? "#181818" : "#ffffff",
        pointBorderWidth: 1.5,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  } : null;

  const githubLineChartOptions = githubStats ? {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: theme === "dark" ? "#181818" : "#ffffff",
        titleColor: theme === "dark" ? "#ffffff" : "#000000",
        bodyColor: theme === "dark" ? "#cccccc" : "#666666",
        borderColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        titleFont: { family: "Space Grotesk", size: 12, weight: "bold" },
        bodyFont: { family: "Space Grotesk", size: 12 },
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => ` Total Repos: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme === "dark" ? "#888888" : "#666666",
          font: { family: "Space Grotesk", size: 10 },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: theme === "dark" ? "#888888" : "#666666",
          font: { family: "Space Grotesk", size: 10 },
          stepSize: 5,
        },
      },
    },
    animation: {
      duration: 1500,
      easing: "easeInOutQuart",
    },
  } : null;

  // GitHub Contribution History Line Chart Config
  const githubContribChartData = githubStats && githubStats.contribHistoryLabels && githubStats.contribHistoryLabels.length > 0 ? {
    labels: githubStats.contribHistoryLabels,
    datasets: [
      {
        label: "Contributions",
        data: githubStats.contribHistoryData,
        borderColor: "#2ea44f",
        backgroundColor: "rgba(46, 164, 79, 0.05)",
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: "#2ea44f",
        pointBorderColor: theme === "dark" ? "#181818" : "#ffffff",
        pointBorderWidth: 1.5,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  } : null;

  const githubContribChartOptions = githubStats ? {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: theme === "dark" ? "#181818" : "#ffffff",
        titleColor: theme === "dark" ? "#ffffff" : "#000000",
        bodyColor: theme === "dark" ? "#cccccc" : "#666666",
        borderColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        titleFont: { family: "Space Grotesk", size: 12, weight: "bold" },
        bodyFont: { family: "Space Grotesk", size: 12 },
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => ` Contributions: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme === "dark" ? "#888888" : "#666666",
          font: { family: "Space Grotesk", size: 10 },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: theme === "dark" ? "#888888" : "#666666",
          font: { family: "Space Grotesk", size: 10 },
        },
      },
    },
    animation: {
      duration: 1500,
      easing: "easeInOutQuart",
    },
  } : null;

  // LeetCode Contest Rating History Line Chart Config
  const attendedHistory = leetcodeContest?.userContestRankingHistory
    ? leetcodeContest.userContestRankingHistory.filter((item) => item.attended)
    : [];

  const leetcodeLineChartData = leetcodeContest && attendedHistory.length > 0 ? {
    labels: attendedHistory.map((item) => item.contest.title.replace(" Contest", "")),
    datasets: [
      {
        label: "Contest Rating",
        data: attendedHistory.map((item) => Math.round(item.rating)),
        borderColor: "#ffa116",
        backgroundColor: "rgba(255, 161, 22, 0.05)",
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: "#ffa116",
        pointBorderColor: theme === "dark" ? "#181818" : "#ffffff",
        pointBorderWidth: 1.5,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  } : null;

  const leetcodeLineChartOptions = leetcodeContest ? {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: theme === "dark" ? "#181818" : "#ffffff",
        titleColor: theme === "dark" ? "#ffffff" : "#000000",
        bodyColor: theme === "dark" ? "#cccccc" : "#666666",
        borderColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        titleFont: { family: "Space Grotesk", size: 12, weight: "bold" },
        bodyFont: { family: "Space Grotesk", size: 12 },
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => ` Rating: ${Math.round(context.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme === "dark" ? "#888888" : "#666666",
          font: { family: "Space Grotesk", size: 10 },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: theme === "dark" ? "#888888" : "#666666",
          font: { family: "Space Grotesk", size: 10 },
        },
      },
    },
    animation: {
      duration: 1500,
      easing: "easeInOutQuart",
    },
  } : null;

  return (
    <section
      id="activity"
      className="flex flex-col justify-center items-center py-20 px-5 text-center relative"
    >
      {/* Title */}
      <StickyTitle className="text-muted-text font-bebas tracking-tighter mb-14 text-[clamp(3.8rem,9.5vw,7.5rem)] leading-none uppercase">
        Coding Activity
      </StickyTitle>

      <div className="w-full max-w-[1200px] flex flex-col gap-12 mt-16">
        {/* 1. GITHUB CALENDAR CARD */}
        <motion.div
          ref={githubRef}
          initial={{ opacity: 0, y: 50 }}
          animate={githubInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="w-full bg-input-bg/50 backdrop-blur-md border border-primary/10 rounded-2xl p-6 md:p-8 shadow-md"
        >
          {/* GitHub Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-primary/10 pb-4">
            <div className="text-left">
              <p className="font-space text-[0.95rem] text-muted-text mt-3.5 flex gap-1 items-center">
                <a
                  href="https://github.com/pranjal-sahu21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-muted-text font-medium cursor-pointer transition-colors duration-200"
                >
                  @pranjal-sahu21
                </a>{" "}
                on Github{" "}
                <img
                  src={`https://cdn.simpleicons.org/github/${theme === "dark" ? "ffffff" : "000000"}`}
                  alt="GitHub"
                  className="w-3.5 h-3.5 object-contain opacity-90"
                />
              </p>
            </div>
          </div>

          {githubLoading ? (
            /* Skeleton Loader */
            <div className="animate-pulse flex flex-col gap-8 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-4 mb-8">
                <div className="lg:col-span-6 h-56 bg-primary/5 border border-primary/10 rounded-xl"></div>
                <div className="lg:col-span-6 h-56 bg-primary/5 border border-primary/10 rounded-xl"></div>
              </div>
            </div>
          ) : githubError ? (
            /* Error Fallback */
            <div className="text-center py-6 font-space text-red-400 text-sm">
              Failed to load some GitHub statistics, rendering contribution calendar only.
            </div>
          ) : githubStats ? (
            /* GitHub Stats Summary Grid */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-4 mb-8">
              {/* Left Panel: Stats Cards */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center gap-6 bg-input-bg/40 border border-primary/5 rounded-xl p-6 sm:p-8 h-full">
                <div className="grid grid-cols-2 gap-3 w-full">
                  <div 
                    className="bg-[#2ea44f]/[0.03] dark:bg-[#2ea44f]/[0.05] border border-[#2ea44f]/10 border-l-4 border-l-[#2ea44f] rounded-lg p-2.5 sm:p-3 shadow-xs text-left font-space"
                    data-hover-text="Public Repos: where my half-finished projects go to sleep forever."
                  >
                    <span className="text-muted-text text-[0.65rem] sm:text-[0.7rem] uppercase tracking-wider block leading-none mb-1">
                      Public Repos
                    </span>
                    <span className="text-[#2ea44f] text-lg sm:text-xl font-bold font-syne">
                      {githubStats.publicRepos}
                    </span>
                  </div>
                  <div 
                    className="bg-[#2ea44f]/[0.03] dark:bg-[#2ea44f]/[0.05] border border-[#2ea44f]/10 border-l-4 border-l-[#2ea44f] rounded-lg p-2.5 sm:p-3 shadow-xs text-left font-space"
                    data-hover-text="Total Stars: My self-worth is directly proportional to this number."
                  >
                    <span className="text-muted-text text-[0.65rem] sm:text-[0.7rem] uppercase tracking-wider block leading-none mb-1">
                      Total Stars
                    </span>
                    <span className="text-[#2ea44f] text-lg sm:text-xl font-bold font-syne">
                      {githubStats.totalStars}
                    </span>
                  </div>
                  <div 
                    className="bg-[#2ea44f]/[0.03] dark:bg-[#2ea44f]/[0.05] border border-[#2ea44f]/10 border-l-4 border-l-[#2ea44f] rounded-lg p-2.5 sm:p-3 shadow-xs text-left font-space"
                    data-hover-text="Pull Requests: Merging code and praying nothing breaks."
                  >
                    <span className="text-muted-text text-[0.65rem] sm:text-[0.7rem] uppercase tracking-wider block leading-none mb-1">
                      Pull Requests
                    </span>
                    <span className="text-[#2ea44f] text-lg sm:text-xl font-bold font-syne">
                      {githubStats.prsCount}
                    </span>
                  </div>
                  <div 
                    className="bg-[#2ea44f]/[0.03] dark:bg-[#2ea44f]/[0.05] border border-[#2ea44f]/10 border-l-4 border-l-[#2ea44f] rounded-lg p-2.5 sm:p-3 shadow-xs text-left font-space"
                    data-hover-text="Followers: We could fit comfortably in a single Git commit."
                  >
                    <span className="text-muted-text text-[0.65rem] sm:text-[0.7rem] uppercase tracking-wider block leading-none mb-1">
                      Followers
                    </span>
                    <span className="text-[#2ea44f] text-lg sm:text-xl font-bold font-syne">
                      {githubStats.followers}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Panel: Languages (Pie Chart) */}
              <div 
                className="lg:col-span-6 flex flex-col justify-center bg-input-bg/40 border border-primary/5 rounded-xl p-6 sm:p-8 h-full"
              >
                <div className="text-left font-space flex flex-col gap-4">
                  <h3 className="text-primary font-syne font-bold text-lg mb-2">Top Languages</h3>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mt-2">
                    {/* Pie Chart via Chart.js */}
                    <div className="w-40 h-40 flex-shrink-0 relative">
                      {githubInView && githubChartData && <Pie data={githubChartData} options={githubChartOptions} />}
                    </div>
                    {/* Legend */}
                    <div className="flex flex-col gap-2 w-full">
                      {githubStats.languages.map((lang, index) => {
                        const color = languageColors[lang.name] || "#888888";
                        return (
                          <div key={lang.name} className="flex items-center gap-2 text-sm">
                            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                            <span className="text-primary font-semibold">{lang.name}</span>
                            <span className="text-muted-text font-normal text-xs ml-auto whitespace-nowrap">
                              {lang.count} {lang.count === 1 ? "repo" : "repos"} ({lang.percentage.toFixed(1)}%)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* GitHub Activity & Growth Charts */}
          {githubStats && (
            <div 
              className="w-full bg-input-bg/40 border border-primary/5 rounded-xl p-6 sm:p-8 text-left font-space mb-8"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-primary font-syne font-bold text-lg">
                  {activeGithubTab === "contributions" ? "Contribution Activity" : "Repository Growth Timeline"}
                </h3>
                {/* Tab Toggles */}
                <div className="flex gap-2 bg-[#2ea44f]/5 p-1 rounded-lg border border-[#2ea44f]/10 select-none">
                  <button
                    onClick={() => setActiveGithubTab("contributions")}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                      activeGithubTab === "contributions"
                        ? "bg-[#2ea44f] text-white shadow-xs"
                        : "text-muted-text hover:text-[#2ea44f]"
                    }`}
                  >
                    Contributions
                  </button>
                  <button
                    onClick={() => setActiveGithubTab("repos")}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                      activeGithubTab === "repos"
                        ? "bg-[#2ea44f] text-white shadow-xs"
                        : "text-muted-text hover:text-[#2ea44f]"
                    }`}
                  >
                    Repositories
                  </button>
                </div>
              </div>
              
              <div className="h-64 sm:h-72 w-full relative flex items-center justify-center">
                {activeGithubTab === "contributions" ? (
                  githubContribChartData ? (
                    githubInView && <Line data={githubContribChartData} options={githubContribChartOptions} />
                  ) : (
                    <div className="text-center text-xs text-muted-text">
                      Loading contribution activity graph...
                    </div>
                  )
                ) : (
                  githubInView && githubLineChartData && <Line data={githubLineChartData} options={githubLineChartOptions} />
                )}
              </div>
            </div>
          )}

          {/* GitHub Heatmap Grid */}
          <div 
            className="calendar-container w-full overflow-x-auto scrollbar-thin select-none flex justify-start md:justify-center text-light-text font-space py-2 mb-8"
            data-hover-text="The denser it gets, the less of a social life I have."
          >
            <GitHubCalendar
              username="pranjal-sahu21"
              theme={githubCalendarTheme}
              colorScheme={theme}
              blockSize={14}
              blockMargin={4}
              fontSize={14}
              showColorLegend={true}
            />
          </div>
        </motion.div>

        {/* 2. LEETCODE DASHBOARD CARD */}
        <motion.div
          ref={leetcodeRef}
          initial={{ opacity: 0, y: 50 }}
          animate={
            leetcodeInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
          }
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 20,
            delay: 0.1,
          }}
          className="w-full bg-input-bg/50 backdrop-blur-md border border-primary/10 rounded-2xl p-6 md:p-8 shadow-md"
        >
          {/* LeetCode Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-primary/10 pb-4">
            <div className="text-left">
              <p className="font-space text-[0.95rem] text-muted-text mt-3.5 flex items-center gap-1">
                <a
                  href="https://leetcode.com/u/Pranjal_1619"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-muted-text font-medium cursor-pointer transition-colors duration-200"
                >
                  @pranjal_1619
                </a>{" "}
                on LeetCode{" "}
                <img
                  src={`https://cdn.simpleicons.org/leetcode/${theme === "dark" ? "ffffff" : "000000"}`}
                  alt="LeetCode"
                  className="w-3.5 h-3.5 object-contain opacity-90"
                />
              </p>
            </div>
            {!loading && !error && leetcodeData && (
              <div className="text-left sm:text-right font-space">
                <div className="text-2xl font-bold text-primary">
                  #{leetcodeData.ranking?.toLocaleString() || "N/A"}
                </div>
                <div className="text-xs text-muted-text uppercase tracking-wider">
                  Global Ranking
                </div>
              </div>
            )}
          </div>

          {loading ? (
            /* Skeleton Loader */
            <div className="animate-pulse flex flex-col gap-8 py-4">
              <div className="h-32 bg-[#181818]/60 rounded-xl w-full"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-24 bg-[#181818]/60 rounded-xl"></div>
                <div className="h-24 bg-[#181818]/60 rounded-xl"></div>
                <div className="h-24 bg-[#181818]/60 rounded-xl"></div>
              </div>
            </div>
          ) : error ? (
            /* Error Display */
            <div className="text-center py-10 font-space">
              <p className="text-red-400 mb-2">
                Error loading LeetCode submission data.
              </p>
              <p className="text-muted-text text-sm">
                Please refresh the page or check again later.
              </p>
            </div>
          ) : (
            /* Content Display */
            <div className="flex flex-col gap-8">
              {/* Stats Summary Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-4">
                {/* Circular Progress & Info */}
                <div className="lg:col-span-6 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6 bg-input-bg/40 border border-primary/5 rounded-xl p-5 sm:p-6 h-full">
                  {renderCircularProgress(
                    leetcodeData.totalSolved || 0,
                    leetcodeData.totalQuestions || 0,
                  )}
                  <div className="text-left font-space grid grid-cols-2 gap-2.5 w-full flex-grow">
                    {leetcodeContest && leetcodeContest.userContestRanking && (
                      <div 
                        className="bg-[#ffa116]/[0.03] dark:bg-[#ffa116]/[0.05] border border-[#ffa116]/10 border-l-4 border-l-[#ffa116] rounded-lg p-2 sm:p-2.5 shadow-xs"
                        data-hover-text="I only play when I feel brave enough to hurt my rating."
                      >
                        <span className="text-muted-text text-[0.6rem] sm:text-[0.65rem] uppercase tracking-wider block leading-none mb-1">
                          Contest Rating
                        </span>
                        <span className="text-[#ffa116] text-base sm:text-lg font-bold font-syne block leading-tight">
                          {Math.round(
                            leetcodeContest.userContestRanking.rating,
                          )}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-neutral-400 font-space font-normal block leading-none mt-1">
                          Top {leetcodeContest.userContestRanking.topPercentage}%
                        </span>
                      </div>
                    )}
                    <div 
                      className="bg-[#ffa116]/[0.03] dark:bg-[#ffa116]/[0.05] border border-[#ffa116]/10 border-l-4 border-l-[#ffa116] rounded-lg p-2 sm:p-2.5 shadow-xs"
                      data-hover-text="People read my solution, take the idea, and vanish in O(1) time."
                    >
                      <span className="text-muted-text text-[0.6rem] sm:text-[0.65rem] uppercase tracking-wider block leading-none mb-1">
                        Reputation
                      </span>
                      <span className="text-[#ffa116] text-base sm:text-lg font-bold font-syne block leading-tight">
                        {leetcodeData.reputation || 0}
                      </span>
                    </div>
                    <div 
                      className="bg-[#ffa116]/[0.03] dark:bg-[#ffa116]/[0.05] border border-[#ffa116]/10 border-l-4 border-l-[#ffa116] rounded-lg p-2 sm:p-2.5 shadow-xs"
                      data-hover-text="Saving points for a T-shirt my grandchildren will redeem."
                    >
                      <span className="text-muted-text text-[0.6rem] sm:text-[0.65rem] uppercase tracking-wider block leading-none mb-1">
                        Points
                      </span>
                      <span className="text-[#ffa116] text-base sm:text-lg font-bold font-syne block leading-tight">
                        {leetcodeData.contributionPoint || 0}
                      </span>
                    </div>
                    <div 
                      className="bg-[#ffa116]/[0.03] dark:bg-[#ffa116]/[0.05] border border-[#ffa116]/10 border-l-4 border-l-[#ffa116] rounded-lg p-2 sm:p-2.5 shadow-xs"
                      data-hover-text="Shiny medals for sitting in front of a monitor too long."
                    >
                      <span className="text-muted-text text-[0.6rem] sm:text-[0.65rem] uppercase tracking-wider block leading-none mb-1">
                        Badges
                      </span>
                      <span className="text-[#ffa116] text-base sm:text-lg font-bold font-syne block leading-tight">
                        {leetcodeBadges?.badgesCount || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Solved Distribution (Doughnut Chart) */}
                <div 
                  className="lg:col-span-6 flex flex-col justify-center bg-input-bg/40 border border-primary/5 rounded-xl p-6 sm:p-8 h-full"
                >
                  <div className="text-left font-space flex flex-col gap-4">
                    <h3 className="text-primary font-syne font-bold text-lg mb-2">Solved Distribution</h3>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mt-2">
                      {/* Pie Chart */}
                      <div className="w-40 h-40 flex-shrink-0 relative">
                        {leetcodeInView && leetcodeChartData && <Pie data={leetcodeChartData} options={leetcodeChartOptions} />}
                      </div>
                      {/* Legend */}
                      <div className="flex flex-col gap-2 w-full">
                        {leetcodeData && [
                          { name: "Easy", count: leetcodeData.easySolved || 0, total: leetcodeData.totalEasy || 0, color: "#00b8a3" },
                          { name: "Medium", count: leetcodeData.mediumSolved || 0, total: leetcodeData.totalMedium || 0, color: "#ffc01e" },
                          { name: "Hard", count: leetcodeData.hardSolved || 0, total: leetcodeData.totalHard || 0, color: "#ef4743" }
                        ].map((item) => {
                          const percent = item.total > 0 ? (item.count / item.total) * 100 : 0;
                          return (
                            <div key={item.name} className="flex items-center gap-2 text-sm">
                              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                              <span className="text-primary font-semibold">{item.name}</span>
                              <span className="text-muted-text font-normal text-xs ml-auto whitespace-nowrap">
                                {item.count} / {item.total} ({percent.toFixed(1)}%)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contest Rating History Line Chart */}
              {leetcodeContest && leetcodeContest.userContestRankingHistory && leetcodeContest.userContestRankingHistory.length > 0 && (
                <div 
                  className="w-full bg-input-bg/40 border border-primary/5 rounded-xl p-6 sm:p-8 text-left font-space"
                >
                  <h3 className="text-primary font-syne font-bold text-lg mb-4">Contest Rating History</h3>
                  <div className="h-64 sm:h-72 w-full relative">
                    {leetcodeInView && leetcodeLineChartData && <Line data={leetcodeLineChartData} options={leetcodeLineChartOptions} />}
                  </div>
                </div>
              )}

              {/* Heatmap Calendar */}
              <div className="w-full flex flex-col gap-2">
                <div 
                  className="calendar-container w-full overflow-x-auto scrollbar-thin select-none flex justify-start md:justify-center text-light-text font-space py-2"
                  data-hover-text="A visual representation of me crying in O(N log N) time complexity."
                >
                  <ActivityCalendar
                    data={leetcodeCalendar}
                    theme={githubCalendarTheme}
                    colorScheme={theme}
                    blockSize={14}
                    blockMargin={4}
                    fontSize={14}
                    showColorLegend={true}
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
