import { inject, track } from "@vercel/analytics";
import { safeAnalyticsUrl } from "./analyticsPolicy.js";

const enabled = import.meta.env.PROD && import.meta.env.VITE_ANALYTICS_ENABLED === "true";
const eventsEnabled = enabled && import.meta.env.VITE_ANALYTICS_EVENTS_ENABLED === "true";

export function startAnalytics() {
  if (!enabled) return;
  inject({ mode: "production", beforeSend: event => {
    const url = safeAnalyticsUrl(event.url);
    return url ? { ...event, url } : null;
  } });
}

const enquiryEvents = new Set(["enquiry_attempt", "enquiry_success", "enquiry_error", "contact_email_click", "contact_phone_click"]);
export function trackEnquiryEvent(name, locale) {
  if (!eventsEnabled || !enquiryEvents.has(name)) return;
  try { track(name, { locale: locale === "en" ? "en" : "zh-hk" }); }
  catch { /* Tracking must never break contact or delivery. */ }
}
