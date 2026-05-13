import Link from "next/link";
import { siteName } from "@/lib/site";

const primaryLinks = [
  { href: "/", label: "Workspace" },
  { href: "/static/bafang-laicai", label: "Static reader" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/copyright", label: "Copyright" },
];

type SiteChromeProps = {
  activeHref?: string;
};

export function SiteHeader({ activeHref }: SiteChromeProps) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="site-brand" href="/">
          <span>{siteName}</span>
          <strong>CJK lyric reader</strong>
        </Link>
        <nav aria-label="Main navigation" className="site-nav">
          {primaryLinks.map((link) => (
            <Link
              aria-current={activeHref === link.href ? "page" : undefined}
              className="site-nav-link"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p>
          &copy; 2026 {siteName}. Public pages are lyric-practice shells; full
          copyrighted lyrics are not bundled.
        </p>
        <nav aria-label="Footer navigation" className="site-footer-links">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/copyright">Copyright</Link>
          <Link href="/llms.txt">AI policy</Link>
        </nav>
      </div>
    </footer>
  );
}
