"use client";

import { SessionProvider } from "next-auth/react";
import "../globals.css";
import { AdminLocaleProvider, AdminLangSwitcher } from "./i18n";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminLocaleProvider>
        <html lang="zh">
          <body className="min-h-screen bg-gray-50">
            <AdminLangSwitcher />
            {children}
          </body>
        </html>
      </AdminLocaleProvider>
    </SessionProvider>
  );
}
