import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Chronicle News | Plain Newspaper Edition",
  description: "A simplified, traditional newspaper format news archive.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 font-sans">
        <header className="border-b-2 border-gray-900 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <Link href="/" className="text-3xl font-bold text-gray-900 block mb-4 uppercase">
               NEWS -Stories
            </Link>
            <nav className="flex gap-4">
              <Link href="/" className="text-sm font-semibold hover:text-gray-700 transition">
                Reader Home
              </Link>
              <Link href="/admin" className="text-sm font-semibold bg-gray-900 text-white px-3 py-1 hover:bg-gray-700 transition">
                Admin Panel
              </Link>
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
