import Head from "next/head"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

type BreadcrumbJsonLdProps = {
  // from the top; the last one is the page itself
  items: { name: string; path: string }[]
}

/** The page's place in the site for search engines (schema.org BreadcrumbList) */
const BreadcrumbJsonLd = ({ items }: BreadcrumbJsonLdProps) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
  return (
    <Head>
      <script
        type="application/ld+json"
        // "<" escaped, so names can't end the script tag
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data).replace(/</g, "\\u003c"),
        }}
      />
    </Head>
  )
}

export default BreadcrumbJsonLd
