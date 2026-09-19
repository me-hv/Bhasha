import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import { AppShell } from '../components/layout/AppShell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const viewport: Viewport = {
  themeColor: '#090A0E',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'BHASHA — Hindi/Hinglish Rap Writing OS',
  description:
    'A personal songwriting and lyric-writing companion for Hindi and Hinglish rappers, lyricists, poets, and songwriters.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jetbrainsMono.variable} ${notoSansDevanagari.variable}`}
    >
      <body className="bg-obsidian-950 text-obsidian-50 font-sans antialiased overflow-hidden m-0 p-0">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
