"use client";

import { useEffect, useRef, useState } from "react";
import {
  listMyNotifications,
  markNotificationRead,
  type NotificationRow,
} from "@/lib/auth-client";

const POLL_MS = 60_000;

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  async function load() {
    try {
      const rows = await listMyNotifications();
      setNotifications(rows);
    } catch {
      // sessizce gec — bildirim zili kritik yol degil
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  async function handleOpenNotification(n: NotificationRow) {
    if (!n.readAt) {
      setNotifications((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, readAt: new Date().toISOString() } : x)),
      );
      markNotificationRead(n.id).catch(() => {});
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Bildirimler"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gold/25 text-ink transition-colors hover:border-gold/50"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-deep px-1 text-[10px] font-bold text-cream">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 max-w-[90vw] overflow-hidden rounded-xl border border-gold/20 bg-cream shadow-xl">
          <div className="border-b border-gold/15 px-4 py-3">
            <p className="text-sm font-semibold text-ink">Bildirimler</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-ink-soft">
                Henüz bildirim yok.
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleOpenNotification(n)}
                  className={`block w-full border-b border-gold/10 px-4 py-3 text-left text-sm transition-colors last:border-0 hover:bg-parchment ${
                    n.readAt ? "text-ink-soft" : "bg-parchment/60 font-medium text-ink"
                  }`}
                >
                  <p>{n.message}</p>
                  <p className="mt-1 text-xs text-ink-soft/70">
                    {new Date(n.sentAt).toLocaleString("tr-TR")}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
