import { useEffect, useState } from "react";

/**
 * In "edge-case" mode, signed-in users can browse the app but can't create/edit data
 * until onboarding + billing is complete.
 *
 * The server layout sets `data-readonly` on the main content wrapper. This hook reads it.
 */
export function useReadOnlyMode(): boolean {
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    const el = document.querySelector("main[data-readonly]");
    setReadOnly(el?.getAttribute("data-readonly") === "true");
  }, []);

  return readOnly;
}

