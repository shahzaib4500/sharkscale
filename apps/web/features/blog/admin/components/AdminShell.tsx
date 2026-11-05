"use client";
import { adminContent } from "@features/blog/admin/adminContent";
import { AdminScreen } from "@features/blog/admin/components/AdminUi";
import { useAdminSession } from "@features/blog/admin/useAdminSession";
import { blogAdminApi } from "@features/blog/api/blogAdminApi";
import { cn } from "@shared/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

const LOGIN_PATH = "/admin/login";

function SignOutButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => blogAdminApi.signOut().catch(() => undefined)} className={className}>
      {adminContent.nav.signOut}
    </button>
  );
}

/** Guards every admin page and adds the admin header. The login page is shown without the guard. */
export default function AdminShell({ children }: { children: ReactNode }) {
  const status = useAdminSession();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === LOGIN_PATH;

  useEffect(() => {
    if (!isLogin && status === "signed-out") {
      router.replace(LOGIN_PATH);
    }
    if (isLogin && (status === "admin" || status === "denied" || status === "error")) {
      router.replace("/admin");
    }
  }, [isLogin, status, router]);

  if (status === "unconfigured") {
    return <AdminScreen eyebrow={adminContent.brandTag} title={adminContent.notConfigured.title} message={adminContent.notConfigured.message} />;
  }
  if (isLogin) {
    return status === "signed-out" ? children : <AdminScreen message={adminContent.loading} />;
  }
  if (status === "loading" || status === "signed-out") {
    return <AdminScreen message={adminContent.loading} />;
  }
  if (status === "error") {
    return <AdminScreen eyebrow={adminContent.brandTag} title={adminContent.sessionError.title} message={adminContent.sessionError.message} />;
  }
  if (status === "denied") {
    return (
      <AdminScreen eyebrow={adminContent.brandTag} title={adminContent.denied.title} message={adminContent.denied.message}>
        <SignOutButton className="mt-6 text-sm font-semibold text-[#2F5BFF]" />
      </AdminScreen>
    );
  }

  const navItems = [
    { href: "/admin", label: adminContent.nav.posts, active: pathname === "/admin" || pathname.startsWith("/admin/posts") },
    { href: "/admin/categories", label: adminContent.nav.categories, active: pathname.startsWith("/admin/categories") }
  ];

  return (
    <div className="min-h-svh bg-[#f6f5f2]">
      <header className="sticky top-0 z-50 bg-tertiary text-white">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-8">
          <Link href="/admin" className="flex shrink-0 items-center gap-2.5 text-[15px] font-bold tracking-[-0.02em] whitespace-nowrap">
            <span className="hidden sm:inline">{adminContent.brand}</span>
            <span className="bg-secondary px-1.5 py-0.5 font-mono text-[10px] tracking-[0.12em] text-tertiary uppercase">{adminContent.brandTag}</span>
          </Link>
          <nav className="flex items-center gap-0.5 text-[13px] font-semibold whitespace-nowrap sm:gap-2 sm:text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-2.5 py-1.5 transition-colors sm:px-3",
                  item.active ? "bg-white/12 text-white" : "text-white/65 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full px-3 py-1.5 text-white/65 transition-colors hover:text-white sm:inline-flex"
            >
              {adminContent.nav.viewBlog}
            </Link>
            <SignOutButton className="rounded-full px-2.5 py-1.5 text-white/65 transition-colors hover:text-white sm:px-3" />
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
