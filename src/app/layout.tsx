import { Footer } from '@/components/layout/footer';
import { Header } from "@/components/layout/header";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Linux User Group - BITS Pilani Dubai Campus',
  description: 'Join the Linux User Group at BITS Pilani Dubai Campus. Explore open-source technology, participate in workshops, and connect with fellow enthusiasts.',
  keywords: 'Linux, Open Source, BITS Pilani, Dubai, Technology, Programming, Workshops',
  authors: [{ name: 'Linux User Group BPDC' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen overflow-x-hidden`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            storageKey="lug-theme"
          >
            {/* Mobile-first flex layout with proper height and overflow control */}
            <div className="flex flex-col min-h-screen w-full">
              <Header />
              <main className="flex-1 w-full overflow-x-hidden">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
