import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Roboto } from 'next/font/google';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';

const roboto = Roboto({ 
  subsets: ['latin'], 
  variable: '--font-roboto',
  weight: ['400', '500', '700'] 
});

export const metadata: Metadata = {
  title: 'DocConnect',
  description: 'Find and book your trusted doctor.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('h-full font-sans', roboto.variable)}>
      <body className="antialiased h-full">
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
