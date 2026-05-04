import type { Metadata, Viewport } from 'next'
import { Inter, Poppins, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getCurrentUser } from '@/lib/auth/helpers'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'CredStack - Smart Credit Card Intelligence',
  description: 'Compare, analyze, and optimize your credit card usage with AI-powered recommendations. Find the best rewards, cashback, and benefits tailored to your spending.',
  keywords: ['credit card', 'rewards', 'cashback', 'compare', 'AI recommendations', 'fintech'],
  authors: [{ name: 'CredStack' }],
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getCurrentUser()
  const fullName =
    (user?.user_metadata as { full_name?: string } | undefined)?.full_name ?? null
  const displayName = fullName?.trim() || user?.email?.split("@")[0] || null

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-background min-h-screen flex flex-col" suppressHydrationWarning>
        <Providers>
          <Header displayName={displayName} />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
