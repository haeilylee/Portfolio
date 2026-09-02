import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/nav";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Hakyeong Lee",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
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
        <main style={{ paddingTop: "var(--nav-h)" }}>
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
