import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const proximaNova = localFont({
  src: [
    {
      path: "../public/proxmanovalight/ProximaNova-Light/Web Fonts/90b3680786db32f9b5c112d1537677db.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/proxymanova/Manova/Web Fonts/584e3c862a2f3de781da5da2233357df.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/proxymanovabold/ProximaNova-Bold/Web Fonts/f697c472b2ad5a1ca383a63c349f3dd9.woff2",
      weight: "700",
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
