/*
 * Tiny localStorage-backed store usable with React's useSyncExternalStore.
 * Snapshots are cached so React sees a stable reference between changes,
 * and the `storage` event keeps several open tabs in sync.
 */
export function createPersistedStore<T>(key: string, fallback: T, validate: (value: unknown) => value is T) {
  let cache: T | undefined;
  const listeners = new Set<() => void>();

  function read(): T {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return fallback;
      const parsed: unknown = JSON.parse(raw);
      return validate(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function emit() {
    listeners.forEach((listener) => listener());
  }

  return {
    get(): T {
      cache ??= read();
      return cache;
    },
    getServer(): T {
      return fallback;
    },
    set(next: T) {
      cache = next;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Storage can be full or blocked (private mode); state still works in memory.
      }
      emit();
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      const onStorage = (event: StorageEvent) => {
        if (event.key !== key) return;
        cache = read();
        emit();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
  };
}

const noopSubscribe = () => () => {};

/** Arguments for useSyncExternalStore that return true only after hydration. */
export const hydratedStore = [noopSubscribe, () => true, () => false] as const;
