"use client";

import { useCallback, useState } from "react";

/**
 * Compares initial and current values to detect if form is dirty.
 * Works with objects (shallow compare) or primitives.
 */
export function useDirtyState<T>(initial: T, current: T): boolean {
  if (typeof initial !== "object" || initial === null) {
    return initial !== current;
  }
  const keys = new Set([
    ...Object.keys(initial as object),
    ...Object.keys(current as object),
  ]);
  for (const k of keys) {
    const a = (initial as Record<string, unknown>)[k];
    const b = (current as Record<string, unknown>)[k];
    if (JSON.stringify(a) !== JSON.stringify(b)) return true;
  }
  return false;
}

/**
 * Form state with dirty detection and reset.
 */
export function useFormState<T>(initial: T) {
  const [state, setState] = useState<T>(initial);
  const [saved, setSaved] = useState<T>(initial);

  const isDirty = useDirtyState(saved, state);

  const update = useCallback((partial: Partial<T>) => {
    setState((prev) => ({ ...prev, ...partial } as T));
  }, []);

  const reset = useCallback(() => {
    setState(saved);
  }, [saved]);

  const save = useCallback((newSaved?: T) => {
    const toSave = newSaved ?? state;
    setSaved(toSave);
    setState(toSave);
  }, [state]);

  // Set initial data (call when loaded from API)
  const setInitial = useCallback((data: T) => {
    setSaved(data);
    setState(data);
  }, []);

  return { state, setState: update, isDirty, reset, save, setInitial };
}
