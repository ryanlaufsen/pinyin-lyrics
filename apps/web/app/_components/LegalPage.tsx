import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "./SiteChrome";

type LegalPageProps = {
  activeHref: string;
  children: ReactNode;
  description: string;
  title: string;
};

export function LegalPage({
  activeHref,
  children,
  description,
  title,
}: LegalPageProps) {
  return (
    <div className="site-shell">
      <SiteHeader activeHref={activeHref} />
      <main className="legal-page">
        <div className="legal-page-inner">
          <header className="legal-hero">
            <p className="legal-eyebrow">Legal</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </header>
          <div className="legal-content">{children}</div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
