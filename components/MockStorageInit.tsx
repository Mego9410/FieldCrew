"use client";

import { useEffect } from "react";
import { initMockStorage } from "@/lib/mock-storage";

export function MockStorageInit() {
  useEffect(() => {
    initMockStorage();
  }, []);
  return null;
}
