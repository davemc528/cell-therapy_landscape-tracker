import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Cell Therapy Landscape Tracker",
  description: "MVP dashboard for tracking cell therapy programs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold">
              Cell Therapy Tracker
            </Link>
            <nav>
              <Link href="/" className="text-sm text-blue-600 hover:underline">
                Dashboard
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-6">{children}</main>
      </body>
    </html>
  );
}
