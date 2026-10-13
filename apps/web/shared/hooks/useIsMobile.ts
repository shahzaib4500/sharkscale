"use client";

import { useEffect, useState } from "react";

// Matches Tailwind's `lg` breakpoint (max-width: 1023.98px) by default.
export default function useIsMobile(maxWidth = 1023.98): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${maxWidth}px)`);

    const update = () => setIsMobile(query.matches);
    update();

    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [maxWidth]);

  return isMobile;
}
