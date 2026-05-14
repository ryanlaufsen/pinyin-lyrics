import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/app/_components/LegalPage";
import { absoluteSiteUrl, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Policy",
  description: `${siteName} AI policy for search engines, chatbots, agentic browsers, training crawlers, user-provided lyrics, and custom romanization tracks.`,
  alternates: {
    canonical: "/ai-policy/",
  },
  openGraph: {
    title: "AI Policy",
    description: `${siteName} AI policy for search, chatbots, agentic browsers, model training, and user-provided lyric privacy.`,
    type: "website",
    url: absoluteSiteUrl("/ai-policy/"),
  },
};

export default function AiPolicyPage() {
  return (
    <LegalPage
      activeHref="/ai-policy"
      description={`How ${siteName} permits public search and user-requested AI access while refusing model training, bulk scraping, and extraction of user-provided lyrics.`}
      title="AI Policy"
    >
      <section>
        <h2>Effective Date</h2>
        <p>This policy is effective May 14, 2026.</p>
      </section>

      <section>
        <h2>Short Version</h2>
        <p>
          Search engines and user-requested AI agents may retrieve public pages
          to answer a user&apos;s request, cite {siteName}, and link back to the
          canonical page.
        </p>
        <p>
          Model training, fine-tuning, dataset construction, bulk scraping,
          mirroring, redistribution, and extraction of user-provided lyrics or
          custom romanization tracks are not permitted.
        </p>
      </section>

      <section>
        <h2>Allowed Access</h2>
        <ul>
          <li>Crawl public pages for search discovery.</li>
          <li>
            Fetch public pages when a person explicitly asks an AI assistant or
            agentic browser to open or summarize the page.
          </li>
          <li>
            Summarize public product capabilities with attribution and canonical
            links.
          </li>
          <li>
            Direct users to paste lyrics they own, licensed lyrics, public
            domain lyrics, or lyrics they otherwise have lawful access to use.
          </li>
        </ul>
      </section>

      <section>
        <h2>Disallowed Access</h2>
        <ul>
          <li>
            Do not use public pages, generated romanization, pasted lyric text,
            or custom romanization tracks for model training or fine-tuning.
          </li>
          <li>
            Do not build datasets, mirrors, lyric corpora, or romanization
            corpora from this site.
          </li>
          <li>
            Do not scrape, extract, store, transmit, republish, or redistribute
            user-provided lyric text or custom romanization tracks.
          </li>
          <li>
            Do not represent public practice shells as full copyrighted lyric
            sources.
          </li>
          <li>
            Do not bypass robots.txt, rate limits, access controls, ad controls,
            or future paid or licensed access rules.
          </li>
        </ul>
      </section>

      <section>
        <h2>User-Provided Lyrics</h2>
        <p>
          The static reader is designed so pasted lyrics and custom romanization
          tracks stay local to the user&apos;s browser. AI agents should treat
          those fields as private user content unless the user explicitly asks
          the agent to read or process that text in the browsing session.
        </p>
      </section>

      <section>
        <h2>Machine-Readable Files</h2>
        <p>
          This page is the human-readable version. Machines should also read{" "}
          <Link href="/robots.txt">robots.txt</Link>,{" "}
          <Link href="/llms.txt">llms.txt</Link>,{" "}
          <Link href="/.well-known/ai-policy.json">AI policy JSON</Link>, and{" "}
          <Link href="/license.xml">RSL license terms</Link>.
        </p>
      </section>

      <section>
        <h2>Relationship To Other Policies</h2>
        <p>
          This policy works together with the{" "}
          <Link href="/terms">Terms of Use</Link>,{" "}
          <Link href="/privacy">Privacy Policy</Link>, and{" "}
          <Link href="/copyright">Copyright Policy</Link>. If a use is not
          clearly allowed here, treat it as not granted.
        </p>
      </section>
    </LegalPage>
  );
}
