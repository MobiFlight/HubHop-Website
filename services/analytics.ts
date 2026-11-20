import * as CookieConsent from "vanilla-cookieconsent"
import { ANALYTICS } from "../lib/cookieConsent"
import { GTM_ID } from "./googleTagManager"
import type { SimType } from "./presetSync"

/**
 * Events sent to Google Tag Manager, with their parameters.
 * docs/analytics.md describes each event and the question it answers.
 */
export type AnalyticsEvents = {
  home_search_submit: { sim: SimType; has_query: boolean }
  popular_aircraft_click: { aircraft: string }
  recent_change_click: Record<string, never>
  vendor_click: { vendor: string }
  add_preset_click: Record<string, never>
  discord_click: Record<string, never>
  news_click: Record<string, never>
  sponsor_click: Record<string, never>
  club_click: Record<string, never>
  donate_click: Record<string, never>
}

type EventName = keyof AnalyticsEvents

// events without parameters are called as track("discord_click")
type ParamsArg<E extends EventName> =
  AnalyticsEvents[E] extends Record<string, never> ? [] : [AnalyticsEvents[E]]

/** Sends an event to Tag Manager; does nothing without analytics consent. */
export const track = <E extends EventName>(
  event: E,
  ...[params]: ParamsArg<E>
) => {
  if (!GTM_ID || !CookieConsent.acceptedCategory(ANALYTICS)) return
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ event, ...params })
}
