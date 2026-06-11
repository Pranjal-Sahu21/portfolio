import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "./context/ThemeContext";

export default function Activity() {
  const { theme } = useTheme();
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

  // Browser Caching Helpers
  const getCachedData = (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    try {
      const { data, timestamp } = JSON.parse(cached);
      // 24 hours = 86,400,000 milliseconds
      if (Date.now() - timestamp < 86400000) {
        return data;
      }
    } catch (e) {
      // Ignore parsing errors
    }
    return null;
  };

  const setCachedData = (key, data) => {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
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

        // Check local cache (v5 forces cache refresh)
        const cached = getCachedData("github_stats_cache_v5");
        if (cached) {
          setGithubStats(cached);
          setGithubLoading(false);
          return;
        }

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
        ]);

        const profileRes = results[0].status === "fulfilled" ? results[0].value : null;
        const reposRes = results[1].status === "fulfilled" ? results[1].value : null;
        const prsRes = results[2].status === "fulfilled" ? results[2].value : null;

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
          setCachedData("github_stats_cache_v5", compiledStats);
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

  // SVGs / Circular Progress calculations
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
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute text-center flex flex-col justify-center items-center">
          <span className="text-4xl md:text-5xl font-bold font-syne text-primary leading-none">
            {solved}
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

  return (
    <section
      id="activity"
      className="min-h-[100svh] flex flex-col justify-center items-center py-20 px-5 text-center relative overflow-hidden"
    >
      {/* Title */}
      <motion.h2
        ref={headingRef}
        className="shimmer-text font-syne font-bold mb-16 text-[clamp(2rem,4vw,3rem)]"
        initial={{ opacity: 0, y: 80 }}
        animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
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
                  {(() => {
                    const themeColors = theme === "dark" 
                      ? ["#ffffff", "#a3a3a3", "#737373", "#404040", "#262626"] 
                      : ["#000000", "#525252", "#8e8e8e", "#c2c2c2", "#e5e5e5"];
                    
                    let cumulativePercentage = 0;
                    const gradientSegments = [];
                    githubStats.languages.forEach((lang, index) => {
                      const start = cumulativePercentage;
                      cumulativePercentage += lang.percentage;
                      const end = cumulativePercentage;
                      const color = themeColors[index % themeColors.length];
                      gradientSegments.push(`${color} ${start.toFixed(1)}% ${end.toFixed(1)}%`);
                    });

                    // Fallback to empty gray circle if no languages found
                    const conicGradientStyle = {
                      background: gradientSegments.length > 0 
                        ? `conic-gradient(${gradientSegments.join(", ")})` 
                        : "currentColor",
                    };

                    return (
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mt-2">
                        {/* Pie Chart */}
                        <div 
                          className={`w-32 h-32 rounded-full border border-primary/10 shadow-xs flex-shrink-0 ${gradientSegments.length === 0 ? "text-primary/10" : ""}`}
                          style={conicGradientStyle}
                        />
                        {/* Legend */}
                        <div className="flex flex-col gap-2 w-full">
                          {githubStats.languages.map((lang, index) => {
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
                    );
                  })()}
                </div>
              </div>
            </div>
          ) : null}

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

                {/* Difficulty Bars */}
                <div className="lg:col-span-6 flex flex-col gap-6 bg-input-bg/40 border border-primary/5 rounded-xl p-6 sm:p-8 h-full justify-center">
                  <div className="text-left font-space flex flex-col gap-6">
                    {/* Easy */}
                    <div 
                      className="cursor-help" 
                      data-hover-text="Easy questions: where I feel like a programming genius!"
                    >
                      <div className="flex justify-between text-base mb-2">
                        <span className="text-neutral-500 dark:text-neutral-400 font-semibold">
                          Easy
                        </span>
                        <span className="text-muted-text font-medium">
                          {leetcodeData.easySolved} / {leetcodeData.totalEasy}
                        </span>
                      </div>
                      <div className="w-full bg-primary/10 h-3 rounded-full overflow-hidden border border-primary/5">
                        <div
                          className="bg-neutral-500 h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${
                              leetcodeData.totalEasy > 0
                                ? (leetcodeData.easySolved /
                                    leetcodeData.totalEasy) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Medium */}
                    <div 
                      className="cursor-help" 
                      data-hover-text="Medium questions: where I spend 2 hours writing 10 lines of code."
                    >
                      <div className="flex justify-between text-base mb-2">
                        <span className="text-neutral-600 dark:text-neutral-300 font-semibold">
                          Medium
                        </span>
                        <span className="text-muted-text font-medium">
                          {leetcodeData.mediumSolved} /{" "}
                          {leetcodeData.totalMedium}
                        </span>
                      </div>
                      <div className="w-full bg-primary/10 h-3 rounded-full overflow-hidden border border-primary/5">
                        <div
                          className="bg-neutral-600 dark:bg-neutral-300 h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${
                              leetcodeData.totalMedium > 0
                                ? (leetcodeData.mediumSolved /
                                    leetcodeData.totalMedium) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Hard */}
                    <div 
                      className="cursor-help" 
                      data-hover-text="Hard questions: where the last testcase always gives TLE (Time Limit Exceeded)."
                    >
                      <div className="flex justify-between text-base mb-2">
                        <span className="text-primary font-semibold">Hard</span>
                        <span className="text-muted-text font-medium">
                          {leetcodeData.hardSolved} / {leetcodeData.totalHard}
                        </span>
                      </div>
                      <div className="w-full bg-primary/10 h-3 rounded-full overflow-hidden border border-primary/5">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${
                              leetcodeData.totalHard > 0
                                ? (leetcodeData.hardSolved /
                                    leetcodeData.totalHard) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
