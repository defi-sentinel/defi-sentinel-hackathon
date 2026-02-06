import type { Metadata } from "next";

import Script from "next/script";

import "./globals.css";
import GlobalHeader from "./components/GlobalHeader";
import GlobalFooter from "./components/GlobalFooter";
import { Providers } from "./providers";
import DebugTools from "./components/DebugTools";

export const metadata: Metadata = {
  title: "DeFi Sentinel - Professional DeFi Rating & Strategy Platform",
  description: "Comprehensive DeFi protocol ratings, risk analysis, and investment strategies. Get expert insights on 100+ DeFi protocols with detailed security assessments and APY analytics.",
  icons: {
    icon: "/images/logos/logo.png",
    shortcut: "/images/logos/logo.png",
    apple: "/images/logos/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Polyfill for global (needed by some wallet libraries)
              if (typeof globalThis.global === 'undefined') {
                globalThis.global = globalThis;
              }

              (function() {
                // Default to dark mode, but respect user preference if explicitly set
                const stored = localStorage.getItem('theme');

                // If user has explicitly set light mode, use it; otherwise default to dark
                if (stored === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  // Default to dark mode
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <GlobalHeader />
            <main className="flex-grow">
              {children}
            </main>
            <GlobalFooter />
            <DebugTools />
          </div>
        </Providers>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7QPCKL3CEZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7QPCKL3CEZ');
          `}
        </Script>
      </body>
    </html>
  );
}

