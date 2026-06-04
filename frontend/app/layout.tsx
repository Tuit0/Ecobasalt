import type { Metadata } from 'next';
import './globals.css';
import { LangProvider } from '@/lib/lang-context';
import { ApplicationModalProvider } from '@/lib/application-modal';
import { ChatProvider } from '@/lib/chat-context';
import Tracking from '@/components/Tracking';
import ChatWidget from '@/components/ChatWidget';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ApplicationModal from '@/components/ApplicationModal';
import FloatingContact from '@/components/FloatingContact';
import ScrollProgress from '@/components/ScrollProgress';

export const metadata: Metadata = {
  title: 'ECO BASALT — Sendvich panellar va bazalt izolyatsiya',
  description:
    'Eko-toza, yong\'inga chidamli sendvich panellar, bazalt izolyatsiya va tola. O\'zbekistondagi yetakchi ishlab chiqaruvchi.',
  keywords: 'eco basalt, sendvich panel, bazalt izolyatsiya, rockwool, sandwich panel, basalt fiber, Tashkent, O\'zbekiston',
  openGraph: {
    title: 'ECO BASALT',
    description: 'Eko-toza sendvich panellar va bazalt izolyatsiya',
    type: 'website',
    locale: 'uz_UZ',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon-32.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="grain-overlay min-h-screen bg-onyx-900">
        <LangProvider>
          <ApplicationModalProvider>
            <ChatProvider>
              <Tracking />
              <ScrollProgress />
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <ChatWidget />
              <FloatingContact />
              <ApplicationModal />
            </ChatProvider>
          </ApplicationModalProvider>
        </LangProvider>
      </body>
    </html>
  );
}
