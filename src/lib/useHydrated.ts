"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// false no HTML do servidor e na hidratação, true depois: para partes que dependem do navegador
// (localStorage, data local) montarem só no cliente, sem divergir do HTML.
export const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
