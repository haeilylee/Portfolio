import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/nav";
import Sidebar from "@/components/sidebar";

export const metadata: Metadata = {
  title: "Hakyeong Lee",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Nav />
        <div
          style={{ paddingTop: "var(--nav-h)" }}
          className="flex min-h-screen"
        >
          <Sidebar />
          <main className="flex-1" style={{ marginLeft: "var(--sidebar-w)" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
