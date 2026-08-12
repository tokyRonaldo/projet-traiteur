// lib/loadingEvents.ts
type Listener = () => void;

const startListeners = new Set<Listener>();
const stopListeners = new Set<Listener>();

export const LoadingEvents = {
  start: () => startListeners.forEach((fn) => fn()),
  stop: () => stopListeners.forEach((fn) => fn()),
  onStart: (fn: Listener) => {
    startListeners.add(fn);
    return () => startListeners.delete(fn);
  },
  onStop: (fn: Listener) => {
    stopListeners.add(fn);
    return () => stopListeners.delete(fn);
  },
};