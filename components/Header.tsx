'use client'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo2.png'

import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import Image from 'next/image'
import landingContent from '@/data/landingContent.json'

const Header = () => {
  let headerClass =
    'flex items-center w-full bg-slate-100 dark:bg-slate-900 dark:text-slate-200 justify-between py-10 mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-10/12 xl:px-0'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }
  // If the pricing section is NOT in the landing content, remove it from the header
  const navLinks = headerNavLinks.filter(
    (link) =>
      !(
        (!landingContent.pricing && link.title === 'Pricing') ||
        (!landingContent.features && link.title === 'Features') ||
        (!landingContent.contact && link.title === 'Contact')
      )
  )
  // Use logo from siteMetadata (always string)
  let logoSrc: string
  if (typeof siteMetadata.siteLogo === 'string') {
    logoSrc = siteMetadata.siteLogo
  } else if (typeof Logo === 'string') {
    logoSrc = Logo
  } else if (Logo && typeof Logo === 'object' && 'src' in Logo) {
    logoSrc = Logo.src as string
  } else {
    logoSrc = '/static/images/logo2.png'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          <div className="mr-3">
            {typeof logoSrc === 'string' && logoSrc.startsWith('http') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoSrc} alt="logo" width={64} height={64} style={{ borderRadius: 4 }} />
            ) : (
              <Image src={logoSrc} alt="logo" width={64} height={64} />
            )}
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 text-2xl font-semibold sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-52 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-fit">
          {navLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="hover:text-primary-500 dark:hover:text-primary-400 m-1 font-medium text-slate-800 dark:text-gray-100"
              >
                {link.title}
              </Link>
            ))}
        </div>
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
