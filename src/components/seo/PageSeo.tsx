import { Helmet } from "react-helmet-async";

const SITE = "https://threadandstack.com";

type PageSeoProps = {
  /** Page <title>. Should be ≤ 60 chars and lead with the keyword. */
  title: string;
  /** Meta description ≤ 160 chars, outcome-led, no em dash. */
  description: string;
  /** Route path, e.g. "/about". Drives canonical + og:url. */
  path: string;
  /** OG type. Defaults to "website"; use "article" for blog posts, "profile" for the founder bio. */
  ogType?: "website" | "article" | "profile" | "event";
  /** Optional JSON-LD payload(s) — one object or an array of objects. */
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  /** Optional override for og:image (otherwise inherits the sitewide image from index.html). */
  ogImage?: string;
  /** When true, emits noindex. Use only for thank-you pages, private pages, etc. */
  noindex?: boolean;
};

/**
 * Per-route head tags. Renders unique title/description/canonical/og:* and
 * optional JSON-LD into the document head via react-helmet-async.
 *
 * Drop near the top of a page's return tree. The sitewide og:image and
 * twitter:* fall back to whatever index.html declares.
 */
export function PageSeo({
  title,
  description,
  path,
  ogType = "website",
  jsonLd,
  ogImage,
  noindex,
}: PageSeoProps) {
  const url = `${SITE}${path.startsWith("/") ? path : `/${path}`}`;
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}
      {noindex ? <meta name="robots" content="noindex,nofollow" /> : null}
      {ldArray.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
}

export default PageSeo;
