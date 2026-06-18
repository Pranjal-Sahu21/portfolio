import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "./context/ThemeContext";
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
import { Doughnut, Line } from "react-chartjs-2";

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
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, amount: 0.3 });

  const githubRef = useRef(null);
  const githubInView = useInView(githubRef, { once: true, amount: 0.3 });

  const leetcodeRef = useRef(null);
  const leetcodeInView = useInView(leetcodeRef, { once: true, amount: 0.3 });

  // Custom monochromatic theme fitting the website design
  const explicitTheme = {
    light: ["#ebedf0", "#cccccc", "#999999", "#555555", "#000000"],
    dark: ["#181818", "#333333", "#666666", "#999999", "#ffffff"],
  };



  // --- GITHUB STATS FETCHING ---
  const [githubStats, setGithubStats] = useState(null);
  const [githubLoading, setGithubLoading] = useState(true);
  const [githubError, setGithubError] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchGithubStats = async () => {
      try {
        setGithubLoading(true);
        setGithubError(null);

        const headers = { Accept: "application/vnd.github.v3+json" };

        // Fetch stats in parallel using allSettled to prevent failures in one endpoint from breaking the whole request
        const results = await Promise.allSettled([
          fetch("https://api.github.com/users/pranjal-sahu21", { headers }),
          fetch(
            "https://api.github.com/users/pranjal-sahu21/repos?per_page=100",
            { headers },
          ),
          fetch(
            "https://api.github.com/search/issues?q=author:pranjal-sahu21+type:pr",
            { headers },
          ),
          fetch("https://github-contributions-api.jogruber.de/v4/pranjal-sahu21"),
        ]);

        const profileRes = results[0].status === "fulfilled" ? results[0].value : null;
        const reposRes = results[1].status === "fulfilled" ? results[1].value : null;
        const prsRes = results[2].status === "fulfilled" ? results[2].value : null;
        const contribsRes = results[3].status === "fulfilled" ? results[3].value : null;

        // Ensure we got at least one of the basic profile/repo responses
        if ((!profileRes || !profileRes.ok) && (!reposRes || !reposRes.ok)) {
          throw new Error("GitHub API rate limit exceeded or network request failed.");
        }

        // Graceful fallbacks for individual failures (e.g. search rate limits or network issues)
        let profile = { public_repos: 0, followers: 0 };
        if (profileRes && profileRes.ok) {
          try {
            profile = await profileRes.json();
          } catch (e) {
            console.error("Error parsing profile:", e);
          }
        }

        let repos = [];
        if (reposRes && reposRes.ok) {
          try {
            repos = await reposRes.json();
          } catch (e) {
            console.error("Error parsing repos:", e);
          }
        }

        let prs = { total_count: 0 };
        if (prsRes && prsRes.ok) {
          try {
            prs = await prsRes.json();
          } catch (e) {
            console.error("Error parsing prs:", e);
          }
        }

        // Process top languages and star counts
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
          .map(([name, count]) => ({
            name,
            count,
            percentage:
              totalReposWithLang > 0 ? (count / totalReposWithLang) * 100 : 0,
          }));

        // Sort repos by creation date to calculate timeline growth
        const sortedRepos = Array.isArray(repos) 
          ? [...repos]
              .filter((r) => r.created_at)
              .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          : [];

        // Build list of months and count repos created per month
        const monthlyRepoCounts = {};
        sortedRepos.forEach((repo) => {
          const date = new Date(repo.created_at);
          const monthLabel = date.toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit",
          });
          monthlyRepoCounts[monthLabel] = (monthlyRepoCounts[monthLabel] || 0) + 1;
        });

        const githubHistoryLabels = [];
        const githubHistoryData = [];
        let runningTotal = 0;

        if (sortedRepos.length > 0) {
          const startDate = new Date(sortedRepos[0].created_at);
          const endDate = new Date();
          
          let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
          while (current <= endDate) {
            const label = current.toLocaleDateString("en-US", {
              month: "short",
              year: "2-digit",
            });
            const countInMonth = monthlyRepoCounts[label] || 0;
            runningTotal += countInMonth;
            
            githubHistoryLabels.push(label);
            githubHistoryData.push(runningTotal);
            
            current.setMonth(current.getMonth() + 1);
          }
        }

        let contributionsData = null;
        if (contribsRes && contribsRes.ok) {
          try {
            contributionsData = await contribsRes.json();
          } catch (e) {
            console.error("Error parsing contributions:", e);
          }
        }

        const contribHistoryLabels = [];
        const contribHistoryData = [];

        if (contributionsData && Array.isArray(contributionsData.contributions)) {
          const sortedContribs = [...contributionsData.contributions].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );

          const monthlyContribCounts = {};
          const monthOrder = [];
          const today = new Date();

          sortedContribs.forEach((c) => {
            const date = new Date(c.date);
            if (date > today) return;

            const monthLabel = date.toLocaleDateString("en-US", {
              month: "short",
              year: "2-digit",
            });

            if (monthlyContribCounts[monthLabel] === undefined) {
              monthlyContribCounts[monthLabel] = 0;
              monthOrder.push(monthLabel);
            }
            monthlyContribCounts[monthLabel] += c.count;
          });

          monthOrder.forEach((label) => {
            contribHistoryLabels.push(label);
            contribHistoryData.push(monthlyContribCounts[label]);
          });
        }

        const compiledStats = {
          publicRepos: profile.public_repos || (Array.isArray(repos) ? repos.length : 0),
          followers: profile.followers || 0,
          totalStars,
          prsCount: prs.total_count || 0,
          languages: sortedLanguages.slice(0, 4),
          otherLanguagesCount: sortedLanguages
            .slice(4)
            .reduce((sum, item) => sum + item.count, 0),
          totalLanguagesCount: totalReposWithLang,
          repoHistoryLabels: githubHistoryLabels,
          repoHistoryData: githubHistoryData,
          contribHistoryLabels,
          contribHistoryData,
        };

        if (sortedLanguages.length > 4) {
          const otherCount = compiledStats.otherLanguagesCount;
          compiledStats.languages.push({
            name: "Other",
            count: otherCount,
            percentage:
              totalReposWithLang > 0
                ? (otherCount / totalReposWithLang) * 100
                : 0,
          });
        }

        if (active) {
          setGithubStats(compiledStats);
          setGithubLoading(false);
        }
      } catch (err) {
        if (active) {
          console.error(err);
          setGithubError(err.message);
          setGithubLoading(false);
        }
      }
    };

    fetchGithubStats();

    return () => {
      active = false;
    };
  }, []);

  // --- LEETCODE STATS FETCHING ---
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [leetcodeCalendar, setLeetcodeCalendar] = useState([]);
  const [leetcodeContest, setLeetcodeContest] = useState(null);
  const [leetcodeBadges, setLeetcodeBadges] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchLeetcodeStats = async () => {
      try {
        setLoading(true);
        setError(null);


        const res = await fetch(
          "https://leetcode-api-faisalshohag.vercel.app/Pranjal_1619",
        );
        if (!res.ok) throw new Error("Failed to fetch LeetCode data");
        const data = await res.json();

        // Optional fetch for contest ranking details (from separate API wrapper)
        let contestData = null;
        try {
          const contestRes = await fetch(
            "https://alfa-leetcode-api.onrender.com/userContestRankingInfo/Pranjal_1619",
          );
          if (contestRes.ok) {
            contestData = await contestRes.json();
          }
        } catch (e) {
          console.error("Contest rating fetch failed (optional):", e);
        }

        // Optional fetch for badges details
        let badgesData = null;
        try {
          const badgesRes = await fetch(
            "https://alfa-leetcode-api.onrender.com/Pranjal_1619/badges",
          );
          if (badgesRes.ok) {
            badgesData = await badgesRes.json();
          }
        } catch (e) {
          console.error("Badges fetch failed (optional):", e);
        }

        if (active) {
          let formattedCalendar = [];
          if (data.submissionCalendar) {
            formattedCalendar = formatSubmissionCalendar(
              data.submissionCalendar,
            );
            setLeetcodeCalendar(formattedCalendar);
          }
          setLeetcodeData(data);
          setLeetcodeContest(contestData);
          setLeetcodeBadges(badgesData);

          setLoading(false);
        }
      } catch (err) {
        if (active) {
          console.error(err);
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchLeetcodeStats();

    return () => {
      active = false;
    };
  }, []);

  // Formats LeetCode's submissionCalendar object { "timestamp": count } to react-activity-calendar structure
  const formatSubmissionCalendar = (submissionCalendar) => {
    const data = [];
    const today = new Date();

    // 1. Generate empty entries for the last 365 days
    for (let i = 365; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const dateString = `${yyyy}-${mm}-${dd}`;

      data.push({
        date: dateString,
        count: 0,
        level: 0,
      });
    }

    // 2. Map submission timestamp counts into the calendar array
    Object.entries(submissionCalendar).forEach(([timestamp, count]) => {
      const date = new Date(parseInt(timestamp) * 1000);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const dateString = `${yyyy}-${mm}-${dd}`;

      // Update matching date entry
      const dayEntry = data.find((d) => d.date === dateString);
      if (dayEntry) {
        dayEntry.count = count;
        if (count === 0) dayEntry.level = 0;
        else if (count <= 2) dayEntry.level = 1;
        else if (count <= 5) dayEntry.level = 2;
        else if (count <= 10) dayEntry.level = 3;
        else dayEntry.level = 4;
      }
    });

    return data;
  };

  // LeetCode Doughnut Chart Data and Options
  const leetcodeChartData = leetcodeData ? {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [
      {
        data: [
          leetcodeData.easySolved || 0,
          leetcodeData.mediumSolved || 0,
          leetcodeData.hardSolved || 0,
        ],
        backgroundColor: theme === "dark"
          ? ["#404040", "#a3a3a3", "#ffffff"]
          : ["#e5e5e5", "#737373", "#000000"],
        borderColor: theme === "dark" ? "#181818" : "#ffffff",
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  } : null;

  const leetcodeChartOptions = leetcodeData ? {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
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
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const percentage = total > 0 ? (solved / total) * 100 : 0;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div 
        className="relative w-52 h-52 md:w-56 md:h-56 flex items-center justify-center flex-shrink-0 cursor-help"
        data-hover-text="That's a lot of questions. I should probably touch some grass."
      >
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-primary/5"
          />
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={leetcodeInView ? { strokeDashoffset: strokeDashoffset } : { strokeDashoffset: circumference }}
            strokeLinecap="round"
            className="text-primary"
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute text-center flex flex-col justify-center items-center pointer-events-none">
          <span className="text-4xl md:text-5xl font-bold font-syne text-primary leading-none">
            <CountUp value={solved} inView={leetcodeInView} duration={1.5} />
          </span>
          <span className="block text-xs md:text-sm text-muted-text font-space uppercase tracking-wider mt-2.5">
            / {total}
          </span>
          <span className="block text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-space font-medium mt-2 leading-none">
            beats 99.8%
          </span>
        </div>
      </div>
    );
  };
  // GitHub Languages Doughnut Chart Data and Options
  const githubChartData = githubStats ? {
    labels: githubStats.languages.map((l) => l.name),
    datasets: [
      {
        data: githubStats.languages.map((l) => l.count),
        backgroundColor: theme === "dark" 
          ? ["#ffffff", "#a3a3a3", "#737373", "#404040", "#262626"] 
          : ["#000000", "#525252", "#8e8e8e", "#c2c2c2", "#e5e5e5"],
        borderColor: theme === "dark" ? "#181818" : "#ffffff",
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  } : null;

  const githubChartOptions = githubStats ? {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
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
        borderColor: theme === "dark" ? "#ffffff" : "#000000",
        backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: theme === "dark" ? "#ffffff" : "#000000",
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
        borderColor: theme === "dark" ? "#ffffff" : "#000000",
        backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: theme === "dark" ? "#ffffff" : "#000000",
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
        borderColor: theme === "dark" ? "#ffffff" : "#000000",
        backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: theme === "dark" ? "#ffffff" : "#000000",
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
      className="min-h-screen flex flex-col justify-center items-center py-20 px-5 text-center relative overflow-hidden"
    >
      {/* Title */}
      <motion.h2
        ref={headingRef}
        className="shimmer-text font-syne font-bold mb-16 text-[clamp(2rem,4vw,3rem)]"
        initial={{ opacity: 0, y: 40 }}
        animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Coding Activity
      </motion.h2>

      <div className="w-full max-w-[1200px] flex flex-col gap-12">
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
                    className="bg-primary/[0.03] dark:bg-primary/[0.05] border border-primary/10 border-l-4 border-l-neutral-500 rounded-lg p-2.5 sm:p-3 shadow-xs text-left font-space cursor-help"
                    data-hover-text="Public Repos: where my half-finished projects go to sleep forever."
                  >
                    <span className="text-muted-text text-[0.65rem] sm:text-[0.7rem] uppercase tracking-wider block leading-none mb-1">
                      Public Repos
                    </span>
                    <span className="text-primary text-lg sm:text-xl font-bold font-syne">
                      {githubStats.publicRepos}
                    </span>
                  </div>
                  <div 
                    className="bg-primary/[0.03] dark:bg-primary/[0.05] border border-primary/10 border-l-4 border-l-neutral-500 rounded-lg p-2.5 sm:p-3 shadow-xs text-left font-space cursor-help"
                    data-hover-text="Total Stars: My self-worth is directly proportional to this number."
                  >
                    <span className="text-muted-text text-[0.65rem] sm:text-[0.7rem] uppercase tracking-wider block leading-none mb-1">
                      Total Stars
                    </span>
                    <span className="text-primary text-lg sm:text-xl font-bold font-syne">
                      {githubStats.totalStars}
                    </span>
                  </div>
                  <div 
                    className="bg-primary/[0.03] dark:bg-primary/[0.05] border border-primary/10 border-l-4 border-l-neutral-500 rounded-lg p-2.5 sm:p-3 shadow-xs text-left font-space cursor-help"
                    data-hover-text="Pull Requests: Merging code and praying nothing breaks."
                  >
                    <span className="text-muted-text text-[0.65rem] sm:text-[0.7rem] uppercase tracking-wider block leading-none mb-1">
                      Pull Requests
                    </span>
                    <span className="text-primary text-lg sm:text-xl font-bold font-syne">
                      {githubStats.prsCount}
                    </span>
                  </div>
                  <div 
                    className="bg-primary/[0.03] dark:bg-primary/[0.05] border border-primary/10 border-l-4 border-l-neutral-500 rounded-lg p-2.5 sm:p-3 shadow-xs text-left font-space cursor-help"
                    data-hover-text="Followers: We could fit comfortably in a single Git commit."
                  >
                    <span className="text-muted-text text-[0.65rem] sm:text-[0.7rem] uppercase tracking-wider block leading-none mb-1">
                      Followers
                    </span>
                    <span className="text-primary text-lg sm:text-xl font-bold font-syne">
                      {githubStats.followers}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Panel: Languages (Pie Chart) */}
              <div 
                className="lg:col-span-6 flex flex-col justify-center bg-input-bg/40 border border-primary/5 rounded-xl p-6 sm:p-8 h-full"
                data-hover-text="Top Languages: JavaScript is my true love, but TypeScript keeps me sane!"
              >
                <div className="text-left font-space flex flex-col gap-4">
                  <h3 className="text-primary font-syne font-bold text-lg mb-2">Top Languages</h3>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mt-2">
                    {/* Pie Chart via Chart.js */}
                    <div className="w-40 h-40 flex-shrink-0 relative">
                      {githubInView && githubChartData && <Doughnut data={githubChartData} options={githubChartOptions} />}
                    </div>
                    {/* Legend */}
                    <div className="flex flex-col gap-2 w-full">
                      {githubStats.languages.map((lang, index) => {
                        const themeColors = theme === "dark" 
                          ? ["#ffffff", "#a3a3a3", "#737373", "#404040", "#262626"] 
                          : ["#000000", "#525252", "#8e8e8e", "#c2c2c2", "#e5e5e5"];
                        const color = themeColors[index % themeColors.length];
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
              data-hover-text={
                activeGithubTab === "contributions"
                  ? "Contributions History: A timeline of my active GitHub contributions."
                  : "Repositories Growth: A timeline of my open-source project creation."
              }
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-primary font-syne font-bold text-lg">
                  {activeGithubTab === "contributions" ? "Contribution Activity" : "Repository Growth Timeline"}
                </h3>
                {/* Tab Toggles */}
                <div className="flex gap-2 bg-primary/5 p-1 rounded-lg border border-primary/10 select-none">
                  <button
                    onClick={() => setActiveGithubTab("contributions")}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                      activeGithubTab === "contributions"
                        ? "bg-primary text-bg shadow-xs"
                        : "text-muted-text hover:text-primary"
                    }`}
                  >
                    Contributions
                  </button>
                  <button
                    onClick={() => setActiveGithubTab("repos")}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                      activeGithubTab === "repos"
                        ? "bg-primary text-bg shadow-xs"
                        : "text-muted-text hover:text-primary"
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
            className="w-full overflow-x-auto scrollbar-thin select-none flex justify-start md:justify-center text-light-text font-space py-2 mb-8 cursor-help"
            data-hover-text="The denser it gets, the less of a social life I have."
          >
            <GitHubCalendar
              username="pranjal-sahu21"
              theme={explicitTheme}
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
                <div className="lg:col-span-6 flex flex-col sm:flex-row lg:flex-row items-center justify-center gap-6 xl:gap-8 bg-input-bg/40 border border-primary/5 rounded-xl p-6 sm:p-8 h-full">
                  {renderCircularProgress(
                    leetcodeData.totalSolved || 0,
                    leetcodeData.totalQuestions || 0,
                  )}
                  <div className="text-left font-space grid grid-cols-2 gap-3 w-full sm:w-auto flex-shrink-0">
                    {leetcodeContest && leetcodeContest.userContestRanking && (
                      <div 
                        className="bg-primary/[0.03] dark:bg-primary/[0.05] border border-primary/10 border-l-4 border-l-neutral-500 rounded-lg p-2.5 sm:p-3 shadow-xs cursor-help"
                        data-hover-text="I only play when I feel brave enough to hurt my rating."
                      >
                        <span className="text-muted-text text-[0.65rem] sm:text-[0.7rem] uppercase tracking-wider block leading-none mb-1">
                          Contest Rating
                        </span>
                        <span className="text-primary text-lg sm:text-xl font-bold font-syne flex items-baseline gap-1">
                          {Math.round(
                            leetcodeContest.userContestRanking.rating,
                          )}
                          <span className="text-[9px] sm:text-[10px] text-neutral-400 font-space font-normal">
                            (Top{" "}
                            {leetcodeContest.userContestRanking.topPercentage}%)
                          </span>
                        </span>
                      </div>
                    )}
                    <div 
                      className="bg-primary/[0.03] dark:bg-primary/[0.05] border border-primary/10 border-l-4 border-l-neutral-500 rounded-lg p-2.5 sm:p-3 shadow-xs cursor-help"
                      data-hover-text="People read my solution, take the idea, and vanish in O(1) time."
                    >
                      <span className="text-muted-text text-[0.65rem] sm:text-[0.7rem] uppercase tracking-wider block leading-none mb-1">
                        Reputation
                      </span>
                      <span className="text-primary text-lg sm:text-xl font-bold font-syne">
                        {leetcodeData.reputation || 0}
                      </span>
                    </div>
                    <div 
                      className="bg-primary/[0.03] dark:bg-primary/[0.05] border border-primary/10 border-l-4 border-l-neutral-500 rounded-lg p-2.5 sm:p-3 shadow-xs cursor-help"
                      data-hover-text="Saving points for a T-shirt my grandchildren will redeem."
                    >
                      <span className="text-muted-text text-[0.65rem] sm:text-[0.7rem] uppercase tracking-wider block leading-none mb-1">
                        Points
                      </span>
                      <span className="text-primary text-lg sm:text-xl font-bold font-syne">
                        {leetcodeData.contributionPoint || 0}
                      </span>
                    </div>
                    <div 
                      className="bg-primary/[0.03] dark:bg-primary/[0.05] border border-primary/10 border-l-4 border-l-neutral-500 rounded-lg p-2.5 sm:p-3 shadow-xs cursor-help"
                      data-hover-text="Shiny medals for sitting in front of a monitor too long."
                    >
                      <span className="text-muted-text text-[0.65rem] sm:text-[0.7rem] uppercase tracking-wider block leading-none mb-1">
                        Badges
                      </span>
                      <span className="text-primary text-lg sm:text-xl font-bold font-syne">
                        {leetcodeBadges?.badgesCount || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Solved Distribution (Doughnut Chart) */}
                <div 
                  className="lg:col-span-6 flex flex-col justify-center bg-input-bg/40 border border-primary/5 rounded-xl p-6 sm:p-8 h-full"
                  data-hover-text="Difficulty Breakdown: A visualization of my programming stats."
                >
                  <div className="text-left font-space flex flex-col gap-4">
                    <h3 className="text-primary font-syne font-bold text-lg mb-2">Solved Distribution</h3>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mt-2">
                      {/* Doughnut Chart */}
                      <div className="w-40 h-40 flex-shrink-0 relative">
                        {leetcodeInView && leetcodeChartData && <Doughnut data={leetcodeChartData} options={leetcodeChartOptions} />}
                      </div>
                      {/* Legend */}
                      <div className="flex flex-col gap-2 w-full">
                        {leetcodeData && [
                          { name: "Easy", count: leetcodeData.easySolved || 0, total: leetcodeData.totalEasy || 0, color: theme === "dark" ? "#404040" : "#e5e5e5" },
                          { name: "Medium", count: leetcodeData.mediumSolved || 0, total: leetcodeData.totalMedium || 0, color: theme === "dark" ? "#a3a3a3" : "#737373" },
                          { name: "Hard", count: leetcodeData.hardSolved || 0, total: leetcodeData.totalHard || 0, color: theme === "dark" ? "#ffffff" : "#000000" }
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
                  data-hover-text="Contest Rating History: A visualization of my programming rank climb."
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
                  className="w-full overflow-x-auto scrollbar-thin select-none flex justify-start md:justify-center text-light-text font-space py-2 cursor-help"
                  data-hover-text="A visual representation of me crying in O(N log N) time complexity."
                >
                  <ActivityCalendar
                    data={leetcodeCalendar}
                    theme={explicitTheme}
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
