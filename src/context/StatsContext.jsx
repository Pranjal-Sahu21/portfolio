import { createContext, useContext, useState, useEffect } from "react";

const StatsContext = createContext();

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
  if (submissionCalendar) {
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
  }

  return data;
};

export const StatsProvider = ({ children }) => {
  // --- GITHUB STATES ---
  const [githubStats, setGithubStats] = useState({
    publicRepos: 22,
    followers: 5,
    totalStars: 10,
    prsCount: 12,
    languages: [],
    otherLanguagesCount: 0,
    totalLanguagesCount: 4,
    contributions: 900,
    repoHistoryLabels: [],
    repoHistoryData: [],
    contribHistoryLabels: [],
    contribHistoryData: [],
  });
  const [githubLoading, setGithubLoading] = useState(true);
  const [githubError, setGithubError] = useState(null);

  // --- LEETCODE STATES ---
  const [leetcodeData, setLeetcodeData] = useState({
    totalSolved: 900,
    easySolved: 303,
    mediumSolved: 432,
    hardSolved: 38,
    totalQuestions: 3962,
    ranking: 68867,
    reputation: 26,
    contributionPoint: 3021,
  });
  const [leetcodeCalendar, setLeetcodeCalendar] = useState([]);
  const [leetcodeContest, setLeetcodeContest] = useState({
    userContestRanking: {
      rating: 2009,
      topPercentage: 1.5,
    },
    userContestRankingHistory: [],
  });
  const [leetcodeBadges, setLeetcodeBadges] = useState({
    badgesCount: 5,
  });
  const [leetcodeLoading, setLeetcodeLoading] = useState(true);
  const [leetcodeError, setLeetcodeError] = useState(null);

  // Fetch GitHub stats
  useEffect(() => {
    let active = true;

    const fetchGithubStats = async () => {
      try {
        setGithubLoading(true);
        setGithubError(null);

        const headers = { Accept: "application/vnd.github.v3+json" };

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

        if ((!profileRes || !profileRes.ok) && (!reposRes || !reposRes.ok)) {
          throw new Error("GitHub API rate limit exceeded or network request failed.");
        }

        let profile = { public_repos: 22, followers: 5 };
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

        let prs = { total_count: 12 };
        if (prsRes && prsRes.ok) {
          try {
            prs = await prsRes.json();
          } catch (e) {
            console.error("Error parsing prs:", e);
          }
        }

        let totalStars = 10;
        const langCounts = {};
        let totalReposWithLang = 0;
        if (Array.isArray(repos) && repos.length > 0) {
          totalStars = 0;
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

        const sortedRepos = Array.isArray(repos) 
          ? [...repos]
              .filter((r) => r.created_at)
              .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          : [];

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
        let contributions = 900;
        if (contribsRes && contribsRes.ok) {
          try {
            contributionsData = await contribsRes.json();
            const total = Object.values(contributionsData.total).reduce((a, b) => a + b, 0);
            if (total > 0) contributions = total;
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
          publicRepos: profile.public_repos || (Array.isArray(repos) ? repos.length : 22),
          followers: profile.followers !== undefined ? profile.followers : 5,
          totalStars,
          prsCount: prs.total_count !== undefined ? prs.total_count : 12,
          languages: sortedLanguages.slice(0, 4),
          otherLanguagesCount: sortedLanguages
            .slice(4)
            .reduce((sum, item) => sum + item.count, 0),
          totalLanguagesCount: totalReposWithLang,
          contributions,
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
          console.error("Github stats fetch error:", err);
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

  // Fetch LeetCode stats
  useEffect(() => {
    let active = true;

    const fetchLeetcodeStats = async () => {
      try {
        setLeetcodeLoading(true);
        setLeetcodeError(null);

        const res = await fetch(
          "https://leetcode-api-faisalshohag.vercel.app/Pranjal_1619",
        );
        if (!res.ok) throw new Error("Failed to fetch LeetCode data");
        const data = await res.json();

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
          if (data.submissionCalendar) {
            const formattedCalendar = formatSubmissionCalendar(
              data.submissionCalendar,
            );
            setLeetcodeCalendar(formattedCalendar);
          }
          setLeetcodeData(data);
          if (contestData) setLeetcodeContest(contestData);
          if (badgesData) setLeetcodeBadges(badgesData);

          setLeetcodeLoading(false);
        }
      } catch (err) {
        if (active) {
          console.error("LeetCode stats fetch error:", err);
          setLeetcodeError(err.message);
          setLeetcodeLoading(false);
        }
      }
    };

    fetchLeetcodeStats();

    return () => {
      active = false;
    };
  }, []);

  return (
    <StatsContext.Provider
      value={{
        githubStats,
        githubLoading,
        githubError,
        leetcodeData,
        leetcodeCalendar,
        leetcodeContest,
        leetcodeBadges,
        leetcodeLoading,
        leetcodeError,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error("useStats must be used within a StatsProvider");
  }
  return context;
};
