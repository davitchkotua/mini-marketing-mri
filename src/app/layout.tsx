import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini Marketing MRI — Davit Chkotua / Marketing Architect Studio",
  description:
    "5-წუთიანი diagnostic-lite assessment, რომელიც გაჩვენებს შენი მარკეტინგის მთავარ სავარაუდო bottleneck-ს.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-line">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
              <a href="/" className="text-sm font-semibold tracking-wide">
                Marketing Architect Studio
              </a>
              <a
                href="https://www.davitchkotua.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-ink uppercase tracking-wider hover:text-accent transition"
              >
                www.davitchkotua.com
              </a>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-line">
            <div className="mx-auto max-w-5xl px-5 py-6 text-xs text-ink-muted">
              © {new Date().getFullYear()} Davit Chkotua / Marketing Architect Studio
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
