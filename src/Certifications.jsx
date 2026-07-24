import { motion, useInView as realUseInView, AnimatePresence } from "framer-motion";
const useInView = () => true;
import { useRef, useState } from "react";
import { Award } from "lucide-react";
import StylishCarousel from "./components/ui/StylishCarousel";
import StickyTitle from "./components/StickyTitle";

import reactHackerRankImg from "../assets/REACT_DEVELOPER_HACKERRANK.png";
import dsaGfgImg from "../assets/DSA_GFG.png";
import nodeUdemyImg from "../assets/NODE_DEVELOPER_UDEMY.png";
import mongoGfgImg from "../assets/MONGO_ARCHITECTURE.png";
import sqlHackerRankImg from "../assets/SQL(INTERMEDIATE)_HACKERRANK.png";
import postgresSimplilearnImg from "../assets/SIMPLILEARN_POSTGRES.png";
import simplilearnLogoImg from "../assets/SIMPLILEARN_LOGO.png";

// ── Brand Logo Components ─────────────────────────────────────────────────────

const HackerRankLogo = () => (
  <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
    <svg viewBox="0 0 24 24" className="w-[13px] h-[13px] fill-current text-[#1ba94c]">
      <path d="M0 0v24h24V0zm9.95 8.002h1.805c.061 0 .111.05.111.111v7.767c0 .061-.05.111-.11.111H9.95c-.061 0-.111-.05-.111-.11v-2.87H7.894v2.87c0 .06-.05.11-.11.11H5.976a.11.11 0 01-.11-.11V8.112c0-.06.05-.11.11-.11h1.806c.061 0 .11.05.11.11v2.869H9.84v-2.87c0-.06.05-.11.11-.11zm2.999 0h5.778c.061 0 .111.05.111.11v7.767a.11.11 0 01-.11.112h-5.78a.11.11 0 01-.11-.11V8.111c0-.06.05-.11.11-.11z"/>
    </svg>
  </div>
);

const GeeksforGeeksLogo = () => (
  <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
    <svg viewBox="0 0 24 24" className="w-[13px] h-[13px] fill-current text-[#2f8d46]">
      <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.34a6.698 6.698 0 0 0-4.949.031A5.708 5.708 0 0 0 1.34 7.73l1.52 1.49a4.166 4.166 0 0 1 4.484-.958c.47.184.898.46 1.26.81.368.36.66.792.859 1.268.146.344.242.708.285 1.08l-9.635.008A4.714 4.714 0 0 0 0 12.457a6.493 6.493 0 0 0 .345 2.127 4.927 4.927 0 0 0 1.08 1.783c.528.56 1.17 1 1.88 1.293a6.454 6.454 0 0 0 2.504.457c.824.005 1.64-.15 2.404-.457a5.986 5.986 0 0 0 1.964-1.277 6.116 6.116 0 0 0 1.686-3.076h.273a6.13 6.13 0 0 0 1.686 3.077 5.99 5.99 0 0 0 1.964 1.276 6.345 6.345 0 0 0 2.405.457 6.45 6.45 0 0 0 2.502-.457 5.42 5.42 0 0 0 1.882-1.293 4.928 4.928 0 0 0 1.08-1.783A6.52 6.52 0 0 0 24 12.457a4.757 4.757 0 0 0-.039-.554z"/>
    </svg>
  </div>
);

const UdemyLogo = () => (
  <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
    <svg viewBox="0 0 24 24" className="w-[9px] h-[9px] fill-current text-[#a435f0]">
      <path d="M12 0L5.81 3.573v3.574l6.189-3.574 6.191 3.574V3.573zM5.81 10.148v8.144c0 1.85.589 3.243 1.741 4.234S10.177 24 11.973 24s3.269-.482 4.448-1.474c1.179-.991 1.768-2.439 1.768-4.314v-8.064h-3.242v7.85c0 2.036-1.509 3.055-2.948 3.055-1.428 0-2.947-.991-2.947-3.027v-7.878z"/>
    </svg>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

export default function Certifications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeIndex, setActiveIndex] = useState(0);

  const certificationsData = [
    // ── June 2026 ──────────────────────────────────────────────────────────
    {
      title: "DSA Certification",
      issuer: "GeeksforGeeks",
      date: "June 2026",
      topics: ["Arrays & Strings", "Trees & Graphs", "Dynamic Programming", "Greedy Algorithms"],
      description: "Demonstrated analytical thinking and complex problem-solving abilities. Validated proficiency in core data structures and algorithms including trees, graphs, greedy methods, sorting, and dynamic programming.",
      link: "https://drive.google.com/file/d/1QmKNku0u8CmGdIGmbH7Q0vhv2pTB5VLo/view?usp=sharing",
      funnyText: "GFG DSA: Mastered 15+ core data structures and complex algorithms topics!",
      image: dsaGfgImg,
      logo: <GeeksforGeeksLogo />,
    },
    {
      title: "Node.js Developer Certification",
      issuer: "Udemy",
      date: "June 2026",
      topics: ["Node.js / Express", "PostgreSQL / MongoDB", "JWT Auth", "Docker Compose"],
      description: "Experienced in full-stack backend development, constructing scalable RESTful APIs, securing applications using JWT authentication and middleware, modeling relational/NoSQL databases, and containerizing via Docker.",
      link: "https://drive.google.com/file/d/1MFq0v7G2bw7nRwYhCozQrYqAKbA-SPuG/view?usp=drive_link",
      funnyText: "Udemy Node: Learned 10+ backend technologies including Node, Docker, ORMs, and Cloud Deployment!",
      image: nodeUdemyImg,
      logo: <UdemyLogo />,
    },
    // ── May 2026 ───────────────────────────────────────────────────────────
    {
      title: "React Developer Certification",
      issuer: "HackerRank",
      date: "May 2026",
      topics: ["React.js", "JavaScript (ES6)", "CSS Grid/Flexbox"],
      description: "Proven capability in building interactive user interfaces with React.js. Validated expertise in React state management, hook mechanisms, custom hooks, JavaScript ES6 concepts, and responsive grid/flexbox layouts.",
      link: "https://drive.google.com/file/d/1B_VNAmS_5NawDiHcQus9MqH4Mu9RFziI/view?usp=sharing",
      funnyText: "HackerRank React: Validated my frontend skills in JavaScript, React, and CSS!",
      image: reactHackerRankImg,
      logo: <HackerRankLogo />,
    },
    {
      title: "SQL (Intermediate)",
      issuer: "HackerRank",
      date: "May 2026",
      topics: ["Relational Queries", "Subqueries & Joins", "Aggregations", "Query Optimization"],
      description: "Validated skills in constructing complex relational queries, implementing nested subqueries, advanced aggregations, tables joining, schema relationship structures, and query execution performance optimization.",
      link: "https://drive.google.com/file/d/1nIBOc97mW8YOuxfXODMgBjUZa39Q0mAF/view?usp=sharing",
      funnyText: "HackerRank SQL: Confirmed my proficiency in relational queries and database commands!",
      image: sqlHackerRankImg,
      logo: <HackerRankLogo />,
    },
    // ── April 2026 ─────────────────────────────────────────────────────────
    {
      title: "MongoDB Architecture",
      issuer: "GeeksforGeeks",
      date: "April 2026",
      topics: ["Data Modeling", "Indexes", "Replication Sets", "Sharding Clusters"],
      description: "Specialized in database architecture and data modeling. Mastery of MongoDB indexing strategies, replica set configuration for high availability, and sharding clusters for enterprise-scale operations.",
      link: "https://drive.google.com/file/d/1-_KRuUd5orE4Qv5zhPW9IL7RuWSzPZpc/view?usp=sharing",
      funnyText: "GFG MongoDB: Learned database architecture, document modeling, sharding, and scaling!",
      image: mongoGfgImg,
      logo: <GeeksforGeeksLogo />,
    },
    {
      title: "PostgreSQL Developer",
      issuer: "Simplilearn",
      date: "April 2026",
      topics: ["PostgreSQL Basics", "SQL Development", "Data Manipulation", "Schema Design"],
      description: "Thorough understanding of relational database administration, database schema design, constraint verification, data manipulation, query optimization, and implementing stored procedures.",
      link: "https://drive.google.com/file/d/1V93UXpsTA7oosK5Wnbgv_pMrIsqSfmnf/view?usp=sharing",
      funnyText: "Simplilearn Postgres: Learned PostgreSQL database design, administration, and querying!",
      image: postgresSimplilearnImg,
      logo: <img src={simplilearnLogoImg} alt="Simplilearn" className="w-3.5 h-3.5 object-contain shrink-0" />,
    },
  ];

  // Map cert data to StylishCarousel items format
  const carouselItems = certificationsData.map((cert) => ({
    src: cert.image,
    alt: cert.title,
    dataAttrs: { "data-hover-text": cert.funnyText },
  }));

  const activeCert = certificationsData[activeIndex];

  return (
    <section
      id="certifications"
      className="flex flex-col justify-center items-center py-24 px-5 text-center relative bg-bg"
      ref={ref}
    >
      {/* Title */}
      <StickyTitle 
        className="text-muted-text font-bebas tracking-tighter mb-16 text-[clamp(3.8rem,9.5vw,7.5rem)] leading-none uppercase"
        blurHeight="h-32"
        negativeMargin="-mb-48"
      >
        Certifications
      </StickyTitle>

      {/* Carousel */}
      <motion.div
        className="w-full flex flex-col items-center mt-32"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <StylishCarousel
          items={carouselItems}
          slideSize="clamp(260px, 70vmin, 480px)"
          aspectRatio="4 / 3"
          rotationDegrees={28}
          inactiveScale={0.62}
          yOffsetPercent={48}
          springBounce={0.15}
          springDuration={0.8}
          showArrows={true}
          showDots={true}
          clickToNavigate={true}
          borderRadius="1rem"
          onIndexChange={setActiveIndex}
          onActiveClick={(i) => window.open(certificationsData[i].link, "_blank")}
          className="w-full"
        />
      </motion.div>

      {/* Active cert info panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          className="md:hidden mt-8 flex flex-col items-center gap-2.5 max-w-lg w-full px-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* Issuer + Date row */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-wider font-space font-semibold px-2.5 py-1 rounded-full border border-primary/15 bg-primary/5 text-muted-text select-none">
              {activeCert.logo}
              {activeCert.issuer}
            </span>
            <span className="text-muted-text font-space text-[0.65rem]">{activeCert.date}</span>
          </div>

          {/* Title */}
          <h3 className="font-syne font-bold text-[clamp(0.9rem,3vw,1.1rem)] text-primary flex items-center gap-2 leading-snug text-center">
            <Award size={14} className="text-primary shrink-0" />
            {activeCert.title}
          </h3>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
