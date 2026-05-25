import type { Metadata } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "ManageX",
  description: "Clean, cost-aware X graph cleanup with safe-listing and server-enforced access.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={geist.variable}>
        <header className="site-nav">
          <div className="nav-inner">
            <Link className="logo" href="/">ManageX</Link>
            <nav className="nav-links" aria-label="Primary navigation">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/candidates">Candidates</Link>
              <Link href="/reports">Reports</Link>
              <Link href="/billing">Billing</Link>
            </nav>
            <div className="nav-spacer" />
            <div className="search-pill" aria-label="Search shortcut"><span>Search...</span><kbd>⌘ K</kbd></div>
            <button className="icon-button" type="button" aria-label="Open command menu">⌘</button>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
