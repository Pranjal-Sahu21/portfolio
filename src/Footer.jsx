import "./style.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="footer-container">
        <p>&copy; {currentYear} Pranjal Sahu. All rights reserved.</p>
      </div>
    </footer>
  );
}
