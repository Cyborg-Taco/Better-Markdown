import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Better Markdown — Customizable GitHub Image Layouts',
  description: 'Improve GitHub Markdown readme layouts with dynamic SVG badges and native responsive grids that expand into smooth lightbox galleries.',
  manifest: '/manifest.json',
  icons: {
    apple: '/apple-icon.png',
  },
  other: {
    'apple-mobile-web-app-title': 'Better Markdown',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-title" content="Better Markdown" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
