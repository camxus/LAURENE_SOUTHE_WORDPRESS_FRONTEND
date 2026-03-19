import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Laurène Southè",
  description: "Works by Laurène Southè",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
