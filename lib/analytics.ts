export interface AnalyticsEvent {
  type: "pageview" | "interaction" | "search" | "download" | "feature";
  page: string;
  label: string;
  value?: string;
  timestamp: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private sessionStart = Date.now();

  track(event: Omit<AnalyticsEvent, "timestamp">) {
    this.events.push({ ...event, timestamp: Date.now() });
    if (typeof window !== "undefined") {
      try {
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...event, timestamp: Date.now(), sessionDuration: Date.now() - this.sessionStart }),
          keepalive: true,
        });
      } catch {}
    }
  }

  pageView(page: string) {
    this.track({ type: "pageview", page, label: "page_view" });
  }

  interaction(page: string, label: string, value?: string) {
    this.track({ type: "interaction", page, label, value });
  }

  search(page: string, query: string) {
    this.track({ type: "search", page, label: "search", value: query });
  }

  download(page: string, item: string) {
    this.track({ type: "download", page, label: "download", value: item });
  }

  feature(page: string, feature: string) {
    this.track({ type: "feature", page, label: "feature_used", value: feature });
  }

  getEvents() {
    return this.events;
  }

  getSessionDuration() {
    return Date.now() - this.sessionStart;
  }
}

export const analytics = typeof window !== "undefined" ? new Analytics() : null;

export function useAnalytics() {
  return analytics;
}
