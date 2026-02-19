import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const proximaNova = localFont({
  src: [
    {
      path: "../public/proxymanova/Manova/Web Fonts/584e3c862a2f3de781da5da2233357df.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-proxima-nova",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SDG Leaderboard",
  description: "Live animated SDG team leaderboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${proximaNova.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
