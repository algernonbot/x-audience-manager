import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "X Audience Manager",
  description: "Clean, cost-aware X graph cleanup with safe-listing and server-enforced access.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
