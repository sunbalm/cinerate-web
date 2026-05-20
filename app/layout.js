import '@/styles/index.css';
import { SocketProvider } from '@/context/SocketContext';
import { GameProvider } from '@/context/GameContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/context/ToastContext';
import RegisterServiceWorker from '@/components/RegisterServiceWorker';

export const metadata = {
  title: 'CineRate',
  description: 'Guess IMDB ratings against friends',
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#9b1c1f",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <SocketProvider>
          <GameProvider>
            <ToastProvider>
            <Header />
            <RegisterServiceWorker />
              {children}
            <Footer />
            </ToastProvider>
          </GameProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
