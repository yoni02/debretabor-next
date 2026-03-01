import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="footer-left">
        <span>© {new Date().getFullYear()} Debre Tabor Holy God Father Ethiopian Orthodox Tewahedo Church</span>
      </div>
      <div className="footer-right">
        <Link href="/" className="footer-link">Home</Link>
        <Link href="/ministries" className="footer-link">Ministries</Link>
        <Link href="/services" className="footer-link">Services</Link>
        <Link href="/contact" className="footer-link">Contact</Link>
        <Link href="/donations" className="footer-link">Donations</Link>
      </div>
    </footer>
  );
}
