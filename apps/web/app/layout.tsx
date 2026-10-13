import CustomCursor from "@shared/components/ui/CustomCursor";
import I18nProvider from "@shared/providers/I18nProvider";
import QueryProvider from "@shared/providers/QueryClientProvider";
import ThemeProvider from "@shared/providers/ThemeProvider";
import ToastProvider from "@shared/providers/ToastProvider";
import "@fontsource-variable/inter/wght.css";
import type { Children } from "@shared/types/children.types";
import type { Metadata } from "next";
import "./globals.css";
import { cn } from "shared/lib/utils";

export const metadata: Metadata = {
  title: "SharkScale",
  description: "SharkScale — data-driven email marketing that maximizes opens, clicks, and sales.",
  icons: {
    icon: "/favicon.png"
  }
};

export default function RootLayout({ children }: Children) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("h-full", "antialiased", "font-sans")}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <I18nProvider>
            <QueryProvider>
              {children}
              <CustomCursor />
              <ToastProvider position="top-right" />
            </QueryProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
