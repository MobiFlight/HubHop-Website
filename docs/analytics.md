# Analytics events

HubHop sends events to Google Tag Manager with `track(event, params)` from `services/analytics.ts`.
`track()` does nothing until the visitor accepted the "analytics" cookie category, and nothing in dev,
PR previews or tests without `NEXT_PUBLIC_GTM_ID` (see "Analytics and cookie consent" in
`.github/instructions/nextjs.instructions.md`).

Events are pushed to the `dataLayer` as `{ event, ...params }`. GA4 event tags for them are configured in
the GTM container, not in code. Parameters never contain free text that could hold personal data
(e.g. no search terms).

To add an event: add it to `AnalyticsEvents` in `services/analytics.ts` and describe it here.

| Event                    | Parameters         | Sent when                                                 | Question it answers                                 |
| ------------------------ | ------------------ | --------------------------------------------------------- | --------------------------------------------------- |
| `discord_click`          |                    | A "Join us on Discord" link is clicked (footer, homepage) | Does HubHop bring people into the community?        |
| `home_search_submit`     | `sim`, `has_query` | The homepage search is submitted                          | Do visitors start with a search, and for which sim? |
| `popular_aircraft_click` | `aircraft`         | A popular aircraft chip on the homepage is clicked        | Are the popular aircraft the right shortcuts?       |
| `recent_change_click`    |                    | A recent change on the homepage is opened                 | Is the recent activity interesting to visitors?     |
| `vendor_click`           | `vendor`           | An aircraft maker card on the homepage is clicked         | Which makers do visitors browse by?                 |
| `add_preset_click`       |                    | "Add a preset" on the homepage is clicked                 | Does the homepage turn visitors into contributors?  |
| `news_click`             | `slot`             | A MobiFlight news promotion is clicked                    | Do HubHop visitors care about MobiFlight news?      |
| `sponsor_click`          | `slot`             | A sponsor promotion is clicked                            | How much attention do partners get from HubHop?     |
| `club_click`             | `slot`             | A MobiFlight Club promotion is clicked                    | Does HubHop bring members to the MobiFlight Club?   |
| `donate_click`           | `slot`             | A donation promotion or link is clicked                   | Does HubHop bring donations?                        |

`slot` is where the promotion was shown: a promotion slot (e.g. `home-news`, `filter-sidebar`, see `SlotId` in
`lib/promotions.ts`) or `home` for the homepage's donation link. Shop promotions aren't counted yet.
