"use client";
import CustomCursor from "@shared/components/ui/CustomCursor";
import { usePathname } from "next/navigation";

/** The custom cursor everywhere except the admin panel, which keeps the normal system cursor. */
export default function SiteCursor() {
  const pathname = usePathname();
  return pathname.startsWith("/admin") ? null : <CustomCursor />;
}
