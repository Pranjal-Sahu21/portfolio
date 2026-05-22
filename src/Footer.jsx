export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center py-10 px-5 bg-[#1a1a1a]/85 border-t border-primary/25" role="contentinfo">
      <div className="relative z-[1]">
        <p className="text-[0.95rem] text-white/80 m-0">&copy; {currentYear} Pranjal Sahu. All rights reserved.</p>
      </div>
    </footer>
  );
}
