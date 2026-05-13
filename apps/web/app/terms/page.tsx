import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/app/_components/LegalPage";
import { absoluteSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms for using Pinyin Lyrics, including user-provided lyrics, copyright boundaries, AI crawler rules, ads, and service limitations.",
  alternates: {
    canonical: "/terms/",
  },
  openGraph: {
    title: "Terms of Use",
    description:
      "Terms for using Pinyin Lyrics, including user-provided lyrics, copyright boundaries, AI crawler rules, ads, and service limitations.",
    type: "website",
    url: absoluteSiteUrl("/terms/"),
  },
};

export default function TermsPage() {
  return (
    <LegalPage
      activeHref="/terms"
      description="These terms define the narrow, practical use of Pinyin Lyrics: a reader for lawful, user-provided CJK lyric text and public song-practice shells."
      title="Terms of Use"
    >
      <section>
        <h2>Effective Date</h2>
        <p>These terms are effective May 13, 2026.</p>
      </section>

      <section>
        <h2>What Pinyin Lyrics Provides</h2>
        <p>
          Pinyin Lyrics provides tools for reading and practicing Chinese,
          Japanese, and Korean song lyrics with romanization support. Public
          song pages are practice shells that may include metadata,
          title-character practice, settings, romanization notes, and a
          browser-local paste workspace.
        </p>
        <p>
          Public pages do not grant rights to full copyrighted lyrics or full
          romanized copyrighted lyrics. You are responsible for using only lyric
          text that you own, licensed text, public-domain text, or text you
          otherwise have lawful access to use.
        </p>
      </section>

      <section>
        <h2>User-Provided Lyrics</h2>
        <p>
          The current static reader processes pasted lyrics in your browser and
          stores the reader state in localStorage on your device. Do not paste
          or share content if doing so would violate copyright, privacy,
          publicity, contract, platform, or other rights.
        </p>
        <p>
          If future account, save, export, or public-sharing features are added,
          those features must include ownership, visibility, provenance,
          takedown, deletion, and moderation controls before public lyric
          content can be indexed or monetized.
        </p>
      </section>

      <section>
        <h2>Prohibited Uses</h2>
        <ul>
          <li>Do not use the service to publish infringing lyrics.</li>
          <li>Do not scrape, mirror, or redistribute public pages in bulk.</li>
          <li>
            Do not use public pages, pasted lyrics, or generated romanization
            for model training, fine-tuning, dataset construction, or bulk
            extraction.
          </li>
          <li>
            Do not bypass robots.txt, AI policy files, rate limits, access
            controls, ad controls, or future paid/licensed access rules.
          </li>
          <li>
            Do not interfere with the service, probe for private content, or
            attempt to exfiltrate localStorage or user-pasted lyric text.
          </li>
        </ul>
      </section>

      <section>
        <h2>AI Agents And Crawlers</h2>
        <p>
          AI search and user-requested agent access to public pages is permitted
          with attribution and canonical links. Model training, dataset
          construction, bulk scraping, and extraction of user-provided lyrics or
          custom romanization tracks are not granted.
        </p>
        <p>
          See <Link href="/robots.txt">robots.txt</Link>,{" "}
          <Link href="/llms.txt">llms.txt</Link>,{" "}
          <Link href="/.well-known/ai-policy.json">AI policy JSON</Link>, and{" "}
          <Link href="/license.xml">RSL license terms</Link>.
        </p>
      </section>

      <section>
        <h2>Ads And Third Parties</h2>
        <p>
          The current static build reserves ad space but does not require you to
          create an account. If advertising, analytics, error reporting, or
          other third-party services are enabled, they must be disclosed in the
          privacy policy and must not receive user-pasted lyric text.
        </p>
      </section>

      <section>
        <h2>No Warranty</h2>
        <p>
          Romanization output can be wrong, incomplete, dialect-dependent, or
          context-dependent. Pinyin Lyrics is provided as a reading aid, not as
          a legal, linguistic, educational, or professional guarantee.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          We may update these terms as the product changes. Material changes
          should be reflected in the devlog, public legal pages, and policy
          files before production launch.
        </p>
      </section>
    </LegalPage>
  );
}
