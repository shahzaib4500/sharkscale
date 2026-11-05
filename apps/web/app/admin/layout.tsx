import AdminShell from "@features/blog/admin/components/AdminShell";
import type { Children } from "@shared/types/children.types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Admin | SharkScale",
  robots: { index: false, follow: false }
};

export default function AdminLayout({ children }: Children) {
  return <AdminShell>{children}</AdminShell>;
}
