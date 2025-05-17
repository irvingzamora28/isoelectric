import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'
import 'css/theme-override.css'

import { Space_Grotesk } from 'next/font/google'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { Analytics as VercelAnalytics } from '@vercel/analytics/next'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { DarkThemeProvider } from './theme-providers'
import { ThemeProvider } from './contexts/ThemeContext'
import AdminLayoutWrapper from './admin-layout-wrapper'
import { getThemeSettings } from './lib/get-theme'
import { Metadata } from 'next'

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})
export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || ''

  // Load theme settings during server rendering
  const themeSettings = await getThemeSettings()
  const initialColor = themeSettings.primaryColor

  return (
    <html
      lang={siteMetadata.language}
      className={`${space_grotesk.variable} scroll-smooth`}
      suppressHydrationWarning
      data-theme-color={initialColor}
    >
      <link rel="apple76" sizes="76x76" href={`${basePath}/static/favicons/apple76.png`} />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${basePath}/static/favicons/favicon32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/static/favicons/favicon16.png`}
      />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <link rel="mask-icon" href={`${basePath}/static/favicons/safari.svg`} color="#0F172A" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      <body className="bg-slate-100 text-slate-800 antialiased dark:bg-slate-900 dark:text-slate-200">
        <DarkThemeProvider>
          <ThemeProvider initialColor={initialColor}>
            <AdminLayoutWrapper
              regularContent={
                <>
                  <VercelAnalytics />
                  <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
                  <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
                    <Header />
                    <main className="mb-auto">{children}</main>
                  </SearchProvider>
                  <Footer />
                </>
              }
            >
              {children}
            </AdminLayoutWrapper>
          </ThemeProvider>
        </DarkThemeProvider>
      </body>
    </html>
  )
}
