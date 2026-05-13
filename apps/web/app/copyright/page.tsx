import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/app/_components/LegalPage";
import { absoluteSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Copyright Policy",
  description:
    "Copyright policy for Pinyin Lyrics, including no bundled full lyrics, user-provided content limits, takedown notices, and repeat-infringer rules.",
  alternates: {
    canonical: "/copyright/",
  },
  openGraph: {
    title: "Copyright Policy",
    description:
      "Copyright policy for Pinyin Lyrics, including no bundled full lyrics, user-provided content limits, takedown notices, and repeat-infringer rules.",
    type: "website",
    url: absoluteSiteUrl("/copyright/"),
  },
};

export default function CopyrightPage() {
  return (
    <LegalPage
      activeHref="/copyright"
      description="Pinyin Lyrics is built around legally clean practice shells and user-provided lyrics. This page defines the copyright boundary and takedown process."
      title="Copyright Policy"
    >
      <section>
        <h2>Effective Date</h2>
        <p>This policy is effective May 13, 2026.</p>
      </section>

      <section>
        <h2>Copyright Boundary</h2>
        <p>
          Pinyin Lyrics does not bundle full copyrighted song lyrics or full
          romanized copyrighted lyrics in public static pages. Song titles,
          artist names, and third-party works remain the property of their
          respective owners.
        </p>
        <p>
          The site&apos;s interface, original explanatory text, public policy
          pages, and product-specific materials are owned by Pinyin Lyrics
          unless otherwise stated.
        </p>
      </section>

      <section>
        <h2>User Responsibilities</h2>
        <p>
          Only paste or process lyrics you own, have licensed, that are in the
          public domain, or that you otherwise have lawful access to use. Do not
          use Pinyin Lyrics to publish, share, scrape, train on, or redistribute
          infringing lyric text.
        </p>
      </section>

      <section>
        <h2>Takedown Notices</h2>
        <p>
          If you believe material available through Pinyin Lyrics infringes your
          copyright, send a notice through{" "}
          <Link href="https://github.com/ryanlaufsen/pinyin-lyrics/issues">
            GitHub Issues
          </Link>
          . Do not include sensitive personal information in a public issue.
        </p>
        <p>Include:</p>
        <ul>
          <li>Your physical or electronic signature.</li>
          <li>
            Identification of the copyrighted work you claim was infringed.
          </li>
          <li>
            The URL or precise location of the material you want removed or
            disabled.
          </li>
          <li>
            Your name, mailing address, telephone number, and email address.
          </li>
          <li>
            A statement that you have a good-faith belief the disputed use is
            not authorized by the copyright owner, its agent, or the law.
          </li>
          <li>
            A statement that the information in your notice is accurate and,
            under penalty of perjury, that you are the copyright owner or
            authorized to act on the owner&apos;s behalf.
          </li>
        </ul>
      </section>

      <section>
        <h2>Counter-Notices And Repeat Infringers</h2>
        <p>
          If future public-sharing features are enabled, Pinyin Lyrics must also
          maintain a counter-notice process, repeat-infringer policy, moderation
          states, and rights-provenance records. Public lyric sharing remains
          blocked until those controls are implemented and reviewed.
        </p>
      </section>

      <section>
        <h2>Designated Agent</h2>
        <p>
          A formal DMCA designated agent registration is required before Pinyin
          Lyrics hosts public user-generated lyric content at production scale.
          The current static prototype does not host public user-uploaded
          lyrics.
        </p>
      </section>
    </LegalPage>
  );
}
