"use client";

import { useEffect } from "react";
import { trackVisit } from "@/lib/auth-client";

const STORAGE_KEY = "kb-visitor-id";

function getOrCreateVisitorId(): string {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

// Admin panelindeki "site trafiği" istatistiği icin — kisisel veri
// icermeyen, localStorage'da tutulan rastgele bir kimlikle gunde bir kere
// sayiliyor (bkz. backend AnalyticsService.trackVisit).
export function VisitorTracker() {
  useEffect(() => {
    try {
      trackVisit(getOrCreateVisitorId());
    } catch {
      // localStorage erisilemez olabilir (gizli sekme vb.) — sessizce gec
    }
  }, []);

  return null;
}
