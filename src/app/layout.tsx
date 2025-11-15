import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Header } from '@/shared/basic-layout/ui/Header';

const notoSansJP = localFont({
  src: [
    {
      path: '../../public/font/NotoSansJP-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/font/NotoSansJP-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/font/NotoSansJP-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/font/NotoSansJP-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-noto-sans-jp',
});

export const metadata: Metadata = {
  title: 'ARCHAIVE demo',
  description: 'ARCHAIVE demo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja'>
      <body className={`${notoSansJP.variable} ${notoSansJP.className} antialiased`}>
        <Header />
        <main className='mt-[45px]'>{children}</main>
      </body>
    </html>
  );
}
