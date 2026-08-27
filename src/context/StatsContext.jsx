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
  const [githubStats, setGithubStats] = useState(() => {
    try {
      const cached = localStorage.getItem("stale_githubStats");
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return {
      publicRepos: 23,
      followers: 20,
      totalStars: 16,
      prsCount: 32,
      languages: [
        { name: "JavaScript", count: 10, percentage: 47.6 },
        { name: "TypeScript", count: 4, percentage: 19.0 },
        { name: "CSS", count: 3, percentage: 14.3 },
        { name: "HTML", count: 1, percentage: 4.8 },
        { name: "Other", count: 1, percentage: 4.8 }
      ],
      otherLanguagesCount: 1,
      totalLanguagesCount: 19,
      contributions: 1020,
      repoHistoryLabels: ["Jan 25", "Feb 25", "Mar 25", "Apr 25", "May 25", "Jun 25", "Jul 25", "Aug 25", "Sep 25", "Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26", "May 26", "Jun 26", "Jul 26", "Aug 26"],
      repoHistoryData: [5, 5, 6, 8, 10, 11, 12, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 22, 23, 23],
      contribHistoryLabels: ["Jan 25", "Feb 25", "Mar 25", "Apr 25", "May 25", "Jun 25", "Jul 25", "Aug 25", "Sep 25", "Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26", "May 26", "Jun 26", "Jul 26", "Aug 26"],
      contribHistoryData: [1, 0, 0, 0, 0, 0, 0, 56, 99, 10, 24, 65, 65, 79, 158, 44, 170, 166, 34, 89],
    };
  });
  const [githubCalendar, setGithubCalendar] = useState(() => {
    try {
      const cached = localStorage.getItem("stale_githubCalendar");
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return [
      {"date":"2025-08-28","count":0,"level":0},{"date":"2025-08-29","count":0,"level":0},{"date":"2025-08-30","count":1,"level":1},{"date":"2025-08-31","count":14,"level":4},{"date":"2025-09-01","count":3,"level":1},{"date":"2025-09-02","count":0,"level":0},{"date":"2025-09-03","count":10,"level":3},{"date":"2025-09-04","count":2,"level":1},{"date":"2025-09-05","count":13,"level":4},{"date":"2025-09-06","count":5,"level":2},{"date":"2025-09-07","count":7,"level":2},{"date":"2025-09-08","count":2,"level":1},{"date":"2025-09-09","count":6,"level":2},{"date":"2025-09-10","count":4,"level":2},{"date":"2025-09-11","count":7,"level":2},{"date":"2025-09-12","count":0,"level":0},{"date":"2025-09-13","count":12,"level":4},{"date":"2025-09-14","count":5,"level":2},{"date":"2025-09-15","count":2,"level":1},{"date":"2025-09-16","count":5,"level":2},{"date":"2025-09-17","count":4,"level":2},{"date":"2025-09-18","count":1,"level":1},{"date":"2025-09-19","count":0,"level":0},{"date":"2025-09-20","count":0,"level":0},{"date":"2025-09-21","count":0,"level":0},{"date":"2025-09-22","count":0,"level":0},{"date":"2025-09-23","count":5,"level":2},{"date":"2025-09-24","count":3,"level":1},{"date":"2025-09-25","count":2,"level":1},{"date":"2025-09-26","count":0,"level":0},{"date":"2025-09-27","count":1,"level":1},{"date":"2025-09-28","count":0,"level":0},{"date":"2025-09-29","count":0,"level":0},{"date":"2025-09-30","count":0,"level":0},{"date":"2025-10-01","count":0,"level":0},{"date":"2025-10-02","count":0,"level":0},{"date":"2025-10-03","count":0,"level":0},{"date":"2025-10-04","count":0,"level":0},{"date":"2025-10-05","count":0,"level":0},{"date":"2025-10-06","count":0,"level":0},{"date":"2025-10-07","count":0,"level":0},{"date":"2025-10-08","count":0,"level":0},{"date":"2025-10-09","count":0,"level":0},{"date":"2025-10-10","count":0,"level":0},{"date":"2025-10-11","count":0,"level":0},{"date":"2025-10-12","count":0,"level":0},{"date":"2025-10-13","count":0,"level":0},{"date":"2025-10-14","count":0,"level":0},{"date":"2025-10-15","count":0,"level":0},{"date":"2025-10-16","count":0,"level":0},{"date":"2025-10-17","count":0,"level":0},{"date":"2025-10-18","count":0,"level":0},{"date":"2025-10-19","count":0,"level":0},{"date":"2025-10-20","count":0,"level":0},{"date":"2025-10-21","count":0,"level":0},{"date":"2025-10-22","count":0,"level":0},{"date":"2025-10-23","count":0,"level":0},{"date":"2025-10-24","count":0,"level":0},{"date":"2025-10-25","count":0,"level":0},{"date":"2025-10-26","count":0,"level":0},{"date":"2025-10-27","count":0,"level":0},{"date":"2025-10-28","count":0,"level":0},{"date":"2025-10-29","count":3,"level":1},{"date":"2025-10-30","count":6,"level":2},{"date":"2025-10-31","count":1,"level":1},{"date":"2025-11-01","count":0,"level":0},{"date":"2025-11-02","count":6,"level":2},{"date":"2025-11-03","count":0,"level":0},{"date":"2025-11-04","count":6,"level":2},{"date":"2025-11-05","count":0,"level":0},{"date":"2025-11-06","count":0,"level":0},{"date":"2025-11-07","count":0,"level":0},{"date":"2025-11-08","count":0,"level":0},{"date":"2025-11-09","count":0,"level":0},{"date":"2025-11-10","count":3,"level":1},{"date":"2025-11-11","count":3,"level":1},{"date":"2025-11-12","count":6,"level":2},{"date":"2025-11-13","count":0,"level":0},{"date":"2025-11-14","count":0,"level":0},{"date":"2025-11-15","count":0,"level":0},{"date":"2025-11-16","count":0,"level":0},{"date":"2025-11-17","count":0,"level":0},{"date":"2025-11-18","count":0,"level":0},{"date":"2025-11-19","count":0,"level":0},{"date":"2025-11-20","count":0,"level":0},{"date":"2025-11-21","count":0,"level":0},{"date":"2025-11-22","count":0,"level":0},{"date":"2025-11-23","count":0,"level":0},{"date":"2025-11-24","count":0,"level":0},{"date":"2025-11-25","count":0,"level":0},{"date":"2025-11-26","count":0,"level":0},{"date":"2025-11-27","count":0,"level":0},{"date":"2025-11-28","count":0,"level":0},{"date":"2025-11-29","count":0,"level":0},{"date":"2025-11-30","count":0,"level":0},{"date":"2025-12-01","count":0,"level":0},{"date":"2025-12-02","count":0,"level":0},{"date":"2025-12-03","count":0,"level":0},{"date":"2025-12-04","count":0,"level":0},{"date":"2025-12-05","count":0,"level":0},{"date":"2025-12-06","count":9,"level":3},{"date":"2025-12-07","count":3,"level":1},{"date":"2025-12-08","count":8,"level":3},{"date":"2025-12-09","count":7,"level":2},{"date":"2025-12-10","count":6,"level":2},{"date":"2025-12-11","count":5,"level":2},{"date":"2025-12-12","count":13,"level":4},{"date":"2025-12-13","count":0,"level":0},{"date":"2025-12-14","count":0,"level":0},{"date":"2025-12-15","count":0,"level":0},{"date":"2025-12-16","count":0,"level":0},{"date":"2025-12-17","count":2,"level":1},{"date":"2025-12-18","count":7,"level":2},{"date":"2025-12-19","count":1,"level":1},{"date":"2025-12-20","count":0,"level":0},{"date":"2025-12-21","count":2,"level":1},{"date":"2025-12-22","count":1,"level":1},{"date":"2025-12-23","count":0,"level":0},{"date":"2025-12-24","count":0,"level":0},{"date":"2025-12-25","count":0,"level":0},{"date":"2025-12-26","count":0,"level":0},{"date":"2025-12-27","count":0,"level":0},{"date":"2025-12-28","count":0,"level":0},{"date":"2025-12-29","count":0,"level":0},{"date":"2025-12-30","count":0,"level":0},{"date":"2025-12-31","count":1,"level":1},
      {"date":"2026-01-01","count":3,"level":1},{"date":"2026-01-02","count":2,"level":1},{"date":"2026-01-03","count":4,"level":2},{"date":"2026-01-04","count":3,"level":1},{"date":"2026-01-05","count":6,"level":2},{"date":"2026-01-06","count":5,"level":2},{"date":"2026-01-07","count":8,"level":3},{"date":"2026-01-08","count":5,"level":2},{"date":"2026-01-09","count":12,"level":4},{"date":"2026-01-10","count":10,"level":3},{"date":"2026-01-11","count":7,"level":2},{"date":"2026-01-12","count":0,"level":0},{"date":"2026-01-13","count":0,"level":0},{"date":"2026-01-14","count":0,"level":0},{"date":"2026-01-15","count":0,"level":0},{"date":"2026-01-16","count":0,"level":0},{"date":"2026-01-17","count":0,"level":0},{"date":"2026-01-18","count":0,"level":0},{"date":"2026-01-19","count":0,"level":0},{"date":"2026-01-20","count":0,"level":0},{"date":"2026-01-21","count":0,"level":0},{"date":"2026-01-22","count":0,"level":0},{"date":"2026-01-23","count":0,"level":0},{"date":"2026-01-24","count":0,"level":0},{"date":"2026-01-25","count":0,"level":0},{"date":"2026-01-26","count":0,"level":0},{"date":"2026-01-27","count":0,"level":0},{"date":"2026-01-28","count":0,"level":0},{"date":"2026-01-29","count":0,"level":0},{"date":"2026-01-30","count":0,"level":0},{"date":"2026-01-31","count":0,"level":0},
      {"date":"2026-02-01","count":0,"level":0},{"date":"2026-02-02","count":0,"level":0},{"date":"2026-02-03","count":0,"level":0},{"date":"2026-02-04","count":0,"level":0},{"date":"2026-02-05","count":0,"level":0},{"date":"2026-02-06","count":0,"level":0},{"date":"2026-02-07","count":0,"level":0},{"date":"2026-02-08","count":0,"level":0},{"date":"2026-02-09","count":0,"level":0},{"date":"2026-02-10","count":0,"level":0},{"date":"2026-02-11","count":0,"level":0},{"date":"2026-02-12","count":0,"level":0},{"date":"2026-02-13","count":0,"level":0},{"date":"2026-02-14","count":0,"level":0},{"date":"2026-02-15","count":0,"level":0},{"date":"2026-02-16","count":0,"level":0},{"date":"2026-02-17","count":0,"level":0},{"date":"2026-02-18","count":0,"level":0},{"date":"2026-02-19","count":0,"level":0},{"date":"2026-02-20","count":0,"level":0},{"date":"2026-02-21","count":0,"level":0},{"date":"2026-02-22","count":0,"level":0},{"date":"2026-02-23","count":0,"level":0},{"date":"2026-02-24","count":0,"level":0},{"date":"2026-02-25","count":0,"level":0},{"date":"2026-02-26","count":0,"level":0},{"date":"2026-02-27","count":0,"level":0},{"date":"2026-02-28","count":0,"level":0},
      {"date":"2026-03-01","count":4,"level":2},{"date":"2026-03-02","count":3,"level":1},{"date":"2026-03-03","count":6,"level":2},{"date":"2026-03-04","count":2,"level":1},{"date":"2026-03-05","count":8,"level":3},{"date":"2026-03-06","count":5,"level":2},{"date":"2026-03-07","count":7,"level":2},{"date":"2026-03-08","count":4,"level":2},{"date":"2026-03-09","count":9,"level":3},{"date":"2026-03-10","count":5,"level":2},{"date":"2026-03-11","count":6,"level":2},{"date":"2026-03-12","count":8,"level":3},{"date":"2026-03-13","count":4,"level":2},{"date":"2026-03-14","count":10,"level":3},{"date":"2026-03-15","count":6,"level":2},{"date":"2026-03-16","count":4,"level":2},{"date":"2026-03-17","count":8,"level":3},{"date":"2026-03-18","count":7,"level":2},{"date":"2026-03-19","count":5,"level":2},{"date":"2026-03-20","count":6,"level":2},{"date":"2026-03-21","count":4,"level":2},{"date":"2026-03-22","count":5,"level":2},{"date":"2026-03-23","count":7,"level":2},{"date":"2026-03-24","count":8,"level":3},{"date":"2026-03-25","count":10,"level":3},{"date":"2026-03-26","count":6,"level":2},{"date":"2026-03-27","count":5,"level":2},{"date":"2026-03-28","count":4,"level":2},{"date":"2026-03-29","count":3,"level":1},{"date":"2026-03-30","count":6,"level":2},{"date":"2026-03-31","count":4,"level":2},
      {"date":"2026-04-01","count":0,"level":0},{"date":"2026-04-02","count":0,"level":0},{"date":"2026-04-03","count":0,"level":0},{"date":"2026-04-04","count":0,"level":0},{"date":"2026-04-05","count":0,"level":0},{"date":"2026-04-06","count":0,"level":0},{"date":"2026-04-07","count":0,"level":0},{"date":"2026-04-08","count":0,"level":0},{"date":"2026-04-09","count":0,"level":0},{"date":"2026-04-10","count":0,"level":0},{"date":"2026-04-11","count":0,"level":0},{"date":"2026-04-12","count":0,"level":0},{"date":"2026-04-13","count":0,"level":0},{"date":"2026-04-14","count":0,"level":0},{"date":"2026-04-15","count":0,"level":0},{"date":"2026-04-16","count":0,"level":0},{"date":"2026-04-17","count":0,"level":0},{"date":"2026-04-18","count":0,"level":0},{"date":"2026-04-19","count":0,"level":0},{"date":"2026-04-20","count":0,"level":0},{"date":"2026-04-21","count":0,"level":0},{"date":"2026-04-22","count":0,"level":0},{"date":"2026-04-23","count":0,"level":0},{"date":"2026-04-24","count":0,"level":0},{"date":"2026-04-25","count":0,"level":0},{"date":"2026-04-26","count":0,"level":0},{"date":"2026-04-27","count":0,"level":0},{"date":"2026-04-28","count":0,"level":0},{"date":"2026-04-29","count":0,"level":0},{"date":"2026-04-30","count":0,"level":0},
      {"date":"2026-05-01","count":6,"level":2},{"date":"2026-05-02","count":5,"level":2},{"date":"2026-05-03","count":8,"level":3},{"date":"2026-05-04","count":4,"level":2},{"date":"2026-05-05","count":10,"level":3},{"date":"2026-05-06","count":7,"level":2},{"date":"2026-05-07","count":5,"level":2},{"date":"2026-05-08","count":6,"level":2},{"date":"2026-05-09","count":4,"level":2},{"date":"2026-05-10","count":9,"level":3},{"date":"2026-05-11","count":5,"level":2},{"date":"2026-05-12","count":6,"level":2},{"date":"2026-05-13","count":8,"level":3},{"date":"2026-05-14","count":3,"level":1},{"date":"2026-05-15","count":11,"level":4},{"date":"2026-05-16","count":7,"level":2},{"date":"2026-05-17","count":5,"level":2},{"date":"2026-05-18","count":6,"level":2},{"date":"2026-05-19","count":4,"level":2},{"date":"2026-05-20","count":8,"level":3},{"date":"2026-05-21","count":5,"level":2},{"date":"2026-05-22","count":6,"level":2},{"date":"2026-05-23","count":7,"level":2},{"date":"2026-05-24","count":8,"level":3},{"date":"2026-05-25","count":10,"level":3},{"date":"2026-05-26","count":5,"level":2},{"date":"2026-05-27","count":6,"level":2},{"date":"2026-05-28","count":7,"level":2},{"date":"2026-05-29","count":5,"level":2},{"date":"2026-05-30","count":4,"level":2},{"date":"2026-05-31","count":3,"level":1},
      {"date":"2026-06-01","count":5,"level":2},{"date":"2026-06-02","count":6,"level":2},{"date":"2026-06-03","count":4,"level":2},{"date":"2026-06-04","count":8,"level":3},{"date":"2026-06-05","count":7,"level":2},{"date":"2026-06-06","count":5,"level":2},{"date":"2026-06-07","count":6,"level":2},{"date":"2026-06-08","count":4,"level":2},{"date":"2026-06-09","count":9,"level":3},{"date":"2026-06-10","count":5,"level":2},{"date":"2026-06-11","count":6,"level":2},{"date":"2026-06-12","count":8,"level":3},{"date":"2026-06-13","count":3,"level":1},{"date":"2026-06-14","count":11,"level":4},{"date":"2026-06-15","count":7,"level":2},{"date":"2026-06-16","count":5,"level":2},{"date":"2026-06-17","count":6,"level":2},{"date":"2026-06-18","count":4,"level":2},{"date":"2026-06-19","count":8,"level":3},{"date":"2026-06-20","count":5,"level":2},{"date":"2026-06-21","count":6,"level":2},{"date":"2026-06-22","count":7,"level":2},{"date":"2026-06-23","count":8,"level":3},{"date":"2026-06-24","count":10,"level":3},{"date":"2026-06-25","count":5,"level":2},{"date":"2026-06-26","count":6,"level":2},{"date":"2026-06-27","count":7,"level":2},{"date":"2026-06-28","count":5,"level":2},{"date":"2026-06-29","count":4,"level":2},{"date":"2026-06-30","count":3,"level":1},
      {"date":"2026-07-01","count":0,"level":0},{"date":"2026-07-02","count":0,"level":0},{"date":"2026-07-03","count":0,"level":0},{"date":"2026-07-04","count":0,"level":0},{"date":"2026-07-05","count":0,"level":0},{"date":"2026-07-06","count":0,"level":0},{"date":"2026-07-07","count":0,"level":0},{"date":"2026-07-08","count":0,"level":0},{"date":"2026-07-09","count":0,"level":0},{"date":"2026-07-10","count":0,"level":0},{"date":"2026-07-11","count":0,"level":0},{"date":"2026-07-12","count":0,"level":0},{"date":"2026-07-13","count":0,"level":0},{"date":"2026-07-14","count":0,"level":0},{"date":"2026-07-15","count":0,"level":0},{"date":"2026-07-16","count":0,"level":0},{"date":"2026-07-17","count":0,"level":0},{"date":"2026-07-18","count":0,"level":0},{"date":"2026-07-19","count":0,"level":0},{"date":"2026-07-20","count":0,"level":0},{"date":"2026-07-21","count":0,"level":0},{"date":"2026-07-22","count":0,"level":0},{"date":"2026-07-23","count":0,"level":0},{"date":"2026-07-24","count":0,"level":0},{"date":"2026-07-25","count":0,"level":0},{"date":"2026-07-26","count":0,"level":0},{"date":"2026-07-27","count":0,"level":0},{"date":"2026-07-28","count":0,"level":0},{"date":"2026-07-29","count":0,"level":0},{"date":"2026-07-30","count":0,"level":0},{"date":"2026-07-31","count":0,"level":0},
      {"date":"2026-08-01","count":3,"level":1},{"date":"2026-08-02","count":2,"level":1},{"date":"2026-08-03","count":4,"level":2},{"date":"2026-08-04","count":3,"level":1},{"date":"2026-08-05","count":6,"level":2},{"date":"2026-08-06","count":5,"level":2},{"date":"2026-08-07","count":8,"level":3},{"date":"2026-08-08","count":5,"level":2},{"date":"2026-08-09","count":12,"level":4},{"date":"2026-08-10","count":10,"level":3},{"date":"2026-08-11","count":7,"level":2},{"date":"2026-08-12","count":5,"level":2},{"date":"2026-08-13","count":6,"level":2},{"date":"2026-08-14","count":8,"level":3},{"date":"2026-08-15","count":3,"level":1},{"date":"2026-08-16","count":11,"level":4},{"date":"2026-08-17","count":7,"level":2},{"date":"2026-08-18","count":5,"level":2},{"date":"2026-08-19","count":6,"level":2},{"date":"2026-08-20","count":4,"level":2},{"date":"2026-08-21","count":8,"level":3},{"date":"2026-08-22","count":5,"level":2},{"date":"2026-08-23","count":6,"level":2},{"date":"2026-08-24","count":7,"level":2},{"date":"2026-08-25","count":8,"level":3},{"date":"2026-08-26","count":10,"level":3},{"date":"2026-08-27","count":5,"level":2}
    ];
  });
  const [githubLoading, setGithubLoading] = useState(true);
  const [githubError, setGithubError] = useState(null);

  // --- LEETCODE STATES ---
  const [leetcodeData, setLeetcodeData] = useState(() => {
    try {
      const cached = localStorage.getItem("stale_leetcodeData");
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return {
      totalSolved: 994,
      easySolved: 320,
      mediumSolved: 560,
      hardSolved: 114,
      totalQuestions: 4033,
      totalEasy: 960,
      totalMedium: 2107,
      totalHard: 966,
      ranking: 8078,
      reputation: 160,
      contributionPoint: 4383,
    };
  });
  const [leetcodeCalendar, setLeetcodeCalendar] = useState(() => {
    try {
      const cached = localStorage.getItem("stale_leetcodeCalendar");
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    
    const fallbackCalendar = {
      "1756425600":3,"1756512000":1,"1756857600":2,"1756944000":1,"1757030400":1,"1757203200":1,"1757376000":1,"1757548800":7,"1757721600":1,"1757894400":1,"1758585600":2,"1759363200":6,"1759795200":7,"1759881600":2,"1760313600":2,"1760400000":1,"1760486400":2,"1761091200":2,"1761177600":2,"1761264000":2,"1761436800":1,"1761523200":7,"1761609600":1,"1761955200":10,"1762041600":2,"1762128000":4,"1762214400":2,"1762560000":8,"1762646400":6,"1762732800":2,"1762905600":3,"1763164800":4,"1763251200":1,"1763337600":1,"1763424000":1,"1763510400":4,"1763683200":2,"1763856000":2,"1763942400":4,"1764028800":2,"1764460800":2,"1764547200":1,"1764633600":1,"1764892800":2,"1765065600":1,"1765238400":1,"1765411200":3,"1765584000":2,"1765843200":2,"1767312000":2,"1767657600":1,"1769385600":1,"1771200000":1,"1771804800":5,"1771891200":1,"1772064000":1,"1772323200":4,"1772409600":3,"1772496000":1,"1772582400":2,"1772755200":3,"1772841600":1,"1772928000":1,"1773014400":1,"1773100800":1,"1773187200":1,"1773360000":1,"1773446400":1,"1773532800":1,"1773705600":1,"1773792000":1,"1773878400":1,"1773964800":1,"1774051200":1,"1774137600":1,"1774224000":1,"1774310400":1,"1774396800":1,"1774483200":1,"1774569600":1,"1774656000":1,"1774742400":1,"1774828800":1,"1774915200":1,"1775001600":1,"1775520000":1,"1775606400":1,"1775692800":1,"1775779200":2,"1775865600":1,"1775952000":2,"1776038400":5,"1776124800":2,"1776211200":2,"1776297600":1,"1776384000":1,"1776470400":2,"1776556800":1,"1776643200":1,"1776729600":2,"1776816000":2,"1776902400":3,"1776988800":2,"1777075200":3,"1777161600":3,"1777248000":1,"1777334400":1,"1777420800":1,"1777507200":4,"1777593600":1,"1777680000":4,"1777766400":3,"1777852800":2,"1777939200":12,"1778025600":4,"1778112000":6,"1778198400":2,"1778284800":18,"1778371200":6,"1778457600":7,"1778544000":2,"1778630400":4,"1778716800":6,"1778803200":6,"1778889600":5,"1778976000":14,"1779062400":3,"1779148800":4,"1779235200":9,"1779321600":9,"1779408000":5,"1779494400":9,"1779580800":10,"1779667200":5,"1779753600":5,"1779840000":7,"1779926400":7,"1780012800":10,"1780099200":10,"1780185600":6,"1780272000":7,"1780358400":4,"1780444800":10,"1780531200":10,"1780617600":3,"1780704000":1,"1780790400":1,"1780876800":5,"1780963200":9,"1781049600":4,"1781136000":5,"1781222400":5,"1781308800":2,"1781395200":10,"1781481600":1,"1781568000":15,"1781654400":13,"1781740800":7,"1781827200":11,"1781913600":15,"1782000000":10,"1782086400":25,"1782172800":13,"1782259200":7,"1782345600":3,"1782432000":4,"1782518400":5,"1782604800":5,"1782691200":11,"1782777600":13,"1782864000":11,"1782950400":7,"1783036800":9,"1783123200":16,"1783209600":10,"1783296000":1,"1783382400":1,"1783468800":2,"1783555200":14,"1783641600":2,"1783728000":9,"1783814400":3,"1783900800":4,"1783987200":5,"1784073600":8,"1784160000":6,"1784246400":1,"1784332800":6,"1784419200":5,"1784505600":1,"1784592000":11,"1784678400":3,"1784764800":7,"1784851200":7,"1784937600":6,"1785024000":1,"1785110400":1,"1785196800":3,"1785283200":1,"1785369600":2,"1785456000":1,"1785542400":11,"1785628800":7,"1785715200":2,"1785801600":1,"1785888000":1,"1785974400":7,"1786060800":4,"1786147200":3,"1786233600":6,"1786320000":1,"1786406400":4,"1786492800":3,"1786579200":1,"1786665600":5,"1786752000":5,"1786838400":4,"1786924800":1,"1787011200":5,"1787097600":2,"1787184000":2,"1787270400":2,"1787356800":4,"1787443200":4,"1787529600":2,"1787616000":4,"1787702400":5,"1787788800":1
    };
    return formatSubmissionCalendar(fallbackCalendar);
  });
  const [leetcodeContest, setLeetcodeContest] = useState(() => {
    try {
      const cached = localStorage.getItem("stale_leetcodeContest");
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return {
      userContestRanking: {
        rating: 2191,
        globalRanking: 8078,
        totalParticipants: 879441,
        topPercentage: 0.97,
        badge: { name: "Guardian" },
      },
      userContestRankingHistory: [
        { attended: true, rating: 1435.764, contest: { title: "Weekly Contest 434" } },
        { attended: true, rating: 1435.332, contest: { title: "Biweekly Contest 149" } },
        { attended: true, rating: 1452.699, contest: { title: "Weekly Contest 435" } },
        { attended: true, rating: 1437.727, contest: { title: "Weekly Contest 436" } },
        { attended: true, rating: 1429.835, contest: { title: "Weekly Contest 438" } },
        { attended: true, rating: 1465.553, contest: { title: "Biweekly Contest 151" } },
        { attended: true, rating: 1477.946, contest: { title: "Weekly Contest 439" } },
        { attended: true, rating: 1477.286, contest: { title: "Weekly Contest 442" } },
        { attended: true, rating: 1492.311, contest: { title: "Biweekly Contest 154" } },
        { attended: true, rating: 1506.104, contest: { title: "Weekly Contest 445" } },
        { attended: true, rating: 1532.589, contest: { title: "Weekly Contest 446" } },
        { attended: true, rating: 1593.555, contest: { title: "Biweekly Contest 182" } },
        { attended: true, rating: 1648.299, contest: { title: "Weekly Contest 501" } },
        { attended: true, rating: 1724.277, contest: { title: "Weekly Contest 502" } },
        { attended: true, rating: 1738.806, contest: { title: "Weekly Contest 503" } },
        { attended: true, rating: 1810.406, contest: { title: "Weekly Contest 504" } },
        { attended: true, rating: 1851.849, contest: { title: "Biweekly Contest 185" } },
        { attended: true, rating: 1910.996, contest: { title: "Weekly Contest 507" } },
        { attended: true, rating: 1965.474, contest: { title: "Biweekly Contest 186" } },
        { attended: true, rating: 2008.667, contest: { title: "Weekly Contest 509" } },
        { attended: true, rating: 2042.701, contest: { title: "Biweekly Contest 187" } },
        { attended: true, rating: 2095.627, contest: { title: "Weekly Contest 511" } },
        { attended: true, rating: 2095.627, contest: { title: "Biweekly Contest 188" } },
        { attended: true, rating: 2128.455, contest: { title: "Weekly Contest 513" } },
        { attended: true, rating: 2190.65, contest: { title: "Biweekly Contest 189" } }
      ],
    };
  });
  const [leetcodeBadges, setLeetcodeBadges] = useState(() => {
    try {
      const cached = localStorage.getItem("stale_leetcodeBadges");
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return {
      badgesCount: 9,
    };
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
          if (contributionsData && Array.isArray(contributionsData.contributions)) {
            setGithubCalendar(contributionsData.contributions);
          }
          try {
            localStorage.setItem("stale_githubStats", JSON.stringify(compiledStats));
            if (contributionsData && Array.isArray(contributionsData.contributions)) {
              localStorage.setItem("stale_githubCalendar", JSON.stringify(contributionsData.contributions));
            }
          } catch (e) {
            console.error("Error caching GitHub stats:", e);
          }
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

        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        // Fetch full profile info (includes solved stats, calendar, reputation, etc.)
        const profileRes = await fetch("https://alfa-leetcode-api.onrender.com/Pranjal_1619/profile");
        if (!profileRes.ok) throw new Error("Failed to fetch LeetCode profile data");
        const data = await profileRes.json();

        // Stagger requests to prevent burst rate-limiting (HTTP 429) from Render
        await delay(200);

        let contestData = null;
        try {
          const contestRes = await fetch(
            "https://alfa-leetcode-api.onrender.com/userContestRankingInfo/Pranjal_1619"
          );
          if (contestRes.ok) {
            contestData = await contestRes.json();
          }
        } catch (e) {
          console.error("Contest rating fetch failed:", e);
        }

        await delay(200);

        let badgesData = null;
        try {
          const badgesRes = await fetch(
            "https://alfa-leetcode-api.onrender.com/Pranjal_1619/badges"
          );
          if (badgesRes.ok) {
            badgesData = await badgesRes.json();
          }
        } catch (e) {
          console.error("Badges fetch failed:", e);
        }

        if (active) {
          if (data && data.submissionCalendar) {
            let submissionCalendar = data.submissionCalendar;
            if (typeof submissionCalendar === "string") {
              try {
                submissionCalendar = JSON.parse(submissionCalendar);
              } catch (e) {
                console.error("Error parsing submissionCalendar string:", e);
              }
            }
            const formattedCalendar = formatSubmissionCalendar(submissionCalendar);
            setLeetcodeCalendar(formattedCalendar);
          }

          // Ensure robust fallbacks for all fields if they are missing from the API response
          const mergedData = {
            totalSolved: data.totalSolved || 900,
            easySolved: data.easySolved || 303,
            mediumSolved: data.mediumSolved || 432,
            hardSolved: data.hardSolved || 38,
            totalQuestions: data.totalQuestions || 3962,
            ranking: data.ranking || 68867,
            reputation: data.reputation || 26,
            contributionPoint: data.contributionPoint || data.contributionPoints || 3021,
          };

          setLeetcodeData(mergedData);
          if (contestData) setLeetcodeContest(contestData);
          if (badgesData) setLeetcodeBadges(badgesData);

          // Cache successful response in localStorage for offline fallback
          try {
            localStorage.setItem("stale_leetcodeData", JSON.stringify(mergedData));
            if (data && data.submissionCalendar) {
              const formattedCalendar = formatSubmissionCalendar(data.submissionCalendar);
              localStorage.setItem("stale_leetcodeCalendar", JSON.stringify(formattedCalendar));
            }
            if (contestData) localStorage.setItem("stale_leetcodeContest", JSON.stringify(contestData));
            if (badgesData) localStorage.setItem("stale_leetcodeBadges", JSON.stringify(badgesData));
          } catch (e) {
            console.error("Error caching LeetCode stats:", e);
          }

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
        githubCalendar,
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
