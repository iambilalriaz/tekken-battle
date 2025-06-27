import { Roboto_Mono } from 'next/font/google';
import '@/app/globals.css';
import 'animate.css';

const inter = Roboto_Mono({ subsets: ['latin'] });
export const metadata = {
  title: 'Tekken Battle',
  description: "Let's fight!",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${inter.className} antialiased relative`}>
        <img
          src='/tekken.png'
          className='fixed inset-0 h-screen w-screen object-cover'
        />
        {children}
      </body>
    </html>
  );
}
