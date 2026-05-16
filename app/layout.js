import '@/styles/index.css';
import { SocketProvider } from '@/context/SocketContext';
import { GameProvider } from '@/context/GameContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/context/ToastContext';

export const metadata = {
  title: 'CineRate',
  description: 'Guess IMDB ratings against friends',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin />
        <link href='https://fonts.googleapis.com/css2?family=Monoton&display=swap' rel='stylesheet'></link>
      </head>
      <body>
        <SocketProvider>
          <GameProvider>
            <ToastProvider>
            <Header />
              {children}
            <Footer />
            </ToastProvider>
          </GameProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
