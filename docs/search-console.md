# Google Search Console

Search Console shows which HubHop pages Google has indexed and which searches lead to them.
The build writes `sitemap.xml` and `robots.txt` (`scripts/sitemap.mjs`); Google needs to be told once.

## Set up (once, by a maintainer)

1. Open https://search.google.com/search-console and sign in with the MobiFlight Google account.
2. **Add property** → **Domain** → `hubhop.mobiflight.com`.
   - If `mobiflight.com` is already a Domain property, HubHop is included and you can skip to step 4.
3. Verify with the DNS TXT record Google shows: add it to the DNS zone of `mobiflight.com`, then click **Verify**
   (DNS changes can take a while).
4. **Sitemaps** → enter `https://hubhop.mobiflight.com/sitemap.xml` → **Submit**.

## What to check

- **Sitemaps**: status "Success" and the number of discovered pages (aircraft cheat sheets, system pages, main pages).
- **Pages**: indexed vs. not indexed. "Crawled - currently not indexed" for some cheat sheets is normal at the start.
  Cheat sheets with fewer than 10 presets are `noindex` on purpose and aren't in the sitemap.
  The preset list and single presets (`/presets/…`) are `noindex` too: they all share one HTML file, so Google
  would see them as duplicates. The cheat sheets are the pages for search engines.
- **Performance**: impressions, clicks and the search terms per page. Use them to improve page texts
  (`lib/aircraftPages.ts`, "Texts for titles, search results and link previews").

The sitemap is rebuilt with every deployment; nothing needs to be resubmitted.
