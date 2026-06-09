export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center py-10 px-5 bg-input-bg/85 border-t border-primary/25" role="contentinfo">
      <div className="relative z-[1]">
        <p className="text-[0.95rem] text-muted-text m-0">&copy; {currentYear} Pranjal Sahu. All rights reserved.</p>
      </div>
    </footer>
  );
}
