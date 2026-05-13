import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/app/_components/LegalPage";
import { absoluteSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Pinyin Lyrics, including local lyric storage, logs, ads, cookies, localStorage, and AI-agent limits.",
  alternates: {
    canonical: "/privacy/",
  },
  openGraph: {
    title: "Privacy Policy",
    description:
      "Privacy policy for Pinyin Lyrics, including local lyric storage, logs, ads, cookies, localStorage, and AI-agent limits.",
    type: "website",
    url: absoluteSiteUrl("/privacy/"),
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      activeHref="/privacy"
      description="This policy explains what the current static app stores, what it does not collect, and what must be true before analytics, ads, or account features are enabled."
      title="Privacy Policy"
    >
      <section>
        <h2>Effective Date</h2>
        <p>This policy is effective May 13, 2026.</p>
      </section>

      <section>
        <h2>Current Static Reader</h2>
        <p>
          The static reader processes pasted lyrics in your browser. The current
          public build does not send pasted lyric text or custom romanization
          tracks to a Pinyin Lyrics server.
        </p>
        <p>
          Reader settings and pasted text may be saved in your browser&apos;s
          localStorage under the key <code>pinyin-lyrics:static-bafang:v1</code>
          . You can clear that data with the in-app clear control where
          available, or through your browser&apos;s site-data settings.
        </p>
      </section>

      <section>
        <h2>Information We May Receive</h2>
        <ul>
          <li>
            Basic hosting logs may be processed by GitHub Pages and related
            infrastructure when you request public pages.
          </li>
          <li>
            If you contact the project through GitHub Issues or another support
            channel, the information you provide there may be visible according
            to that channel&apos;s settings.
          </li>
          <li>
            Future account, save, export, analytics, advertising, and error
            reporting features are blocked until they have privacy-safe logging,
            retention, deletion, and disclosure rules.
          </li>
        </ul>
      </section>

      <section>
        <h2>Lyrics, Analytics, And Ads</h2>
        <p>
          Pinyin Lyrics must not use session replay, analytics capture, ad
          targeting, error reporting, logs, or AI agents to collect lyric
          textarea contents, custom romanization tracks, or private
          lyric-derived output.
        </p>
        <p>
          If Google AdSense or other ad partners are enabled, third-party
          vendors may use cookies, web beacons, IP addresses, or other
          identifiers to serve or measure ads. Personalized ad choices and
          opt-outs must be disclosed before live ad serving is enabled.
        </p>
      </section>

      <section>
        <h2>Cookies And LocalStorage</h2>
        <p>
          The current reader uses localStorage for user convenience. It does not
          need a login cookie. Third-party services may use cookies or similar
          technologies if advertising, analytics, security, or support tools are
          added later.
        </p>
      </section>

      <section>
        <h2>AI Agents</h2>
        <p>
          Public AI search and user-requested fetches may access public pages.
          AI agents are not permitted to collect, store, transmit, train on, or
          summarize user-pasted lyrics or custom romanization tracks unless the
          user explicitly requests that action in their own browsing session.
        </p>
      </section>

      <section>
        <h2>Your Choices</h2>
        <ul>
          <li>Clear localStorage through your browser settings.</li>
          <li>Do not paste sensitive, private, or infringing lyric text.</li>
          <li>
            Use browser or platform controls to limit cookies and personalized
            advertising if ad partners are enabled.
          </li>
          <li>
            Contact the project through{" "}
            <Link href="https://github.com/ryanlaufsen/pinyin-lyrics/issues">
              GitHub Issues
            </Link>{" "}
            for privacy requests about project-maintained data.
          </li>
        </ul>
      </section>

      <section>
        <h2>Children</h2>
        <p>
          Pinyin Lyrics is not directed to children under 13. Do not use the
          service to submit children&apos;s personal information.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>
          Privacy disclosures must be updated before any new analytics, ads,
          account, storage, sharing, export, or moderation feature is enabled.
        </p>
      </section>
    </LegalPage>
  );
}
