"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { createPersistedStore, hydratedStore } from "@/lib/storage";

/*
 * Cookie consent (GDPR / TTDSG). Nothing optional runs before the visitor
 * opts in; "reject" is as easy as "accept"; the choice can be changed at any
 * time from the footer. Bump CONSENT_VERSION when categories change to ask again.
 *
 * Gate future scripts like:  const { consent } = useConsent();
 *                             if (consent?.analytics) loadAnalytics();
 */
export const CONSENT_VERSION = 1;

export interface Consent {
  version: number;
  /** ISO timestamp of the choice, kept as proof of consent. */
  date: string;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

export type OptionalCategory = "analytics" | "marketing";

const consentStore = createPersistedStore<Consent | null>("maison-lume:consent", null, (v): v is Consent | null => {
  if (v === null) return true;
  const c = v as Partial<Consent>;
  return c?.version === CONSENT_VERSION && typeof c.analytics === "boolean" && typeof c.marketing === "boolean";
});

interface ConsentContextValue {
  consent: Consent | null;
  /** True once the stored choice has been read on the client. */
  hydrated: boolean;
  settingsOpen: boolean;
  save: (choice: Record<OptionalCategory, boolean>) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  openSettings: () => void;
  closeSettings: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const consent = useSyncExternalStore(consentStore.subscribe, consentStore.get, consentStore.getServer);
  const hydrated = useSyncExternalStore(...hydratedStore);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const save = useCallback((choice: Record<OptionalCategory, boolean>) => {
    consentStore.set({ version: CONSENT_VERSION, date: new Date().toISOString(), necessary: true, ...choice });
    setSettingsOpen(false);
  }, []);
  const acceptAll = useCallback(() => save({ analytics: true, marketing: true }), [save]);
  const rejectAll = useCallback(() => save({ analytics: false, marketing: false }), [save]);
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const value = useMemo(
    () => ({ consent, hydrated, settingsOpen, save, acceptAll, rejectAll, openSettings, closeSettings }),
    [consent, hydrated, settingsOpen, save, acceptAll, rejectAll, openSettings, closeSettings],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used inside <ConsentProvider>");
  return ctx;
}
