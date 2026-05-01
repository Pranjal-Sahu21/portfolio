export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden text-center py-10 px-5 bg-gradient-to-br from-[#0a0a0a]/95 to-[#141414]/95 border-t border-primary/25 before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(120deg,rgba(226,88,34,0.15),rgba(255,255,255,0.05),rgba(226,88,34,0.15))] before:bg-[length:300%_300%] before:animate-[shimmer_12s_linear_infinite] before:pointer-events-none">
      <div className="relative z-[1]">
        <p className="text-[0.95rem] text-white/80 m-0">&copy; {currentYear} Pranjal Sahu. All rights reserved.</p>
      </div>
    </footer>
  );
}
