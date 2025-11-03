
import React, { useState, useEffect, useCallback } from 'react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  /**
   * Handles smooth scrolling for all on-page navigation links.
   * It prevents the default anchor behavior and uses scrollIntoView
   * for a robust, smooth scroll that works consistently.
   */
  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    // Ensure we have a valid hash link
    if (!targetId || !targetId.startsWith('#')) return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
        });
    }

    // Close mobile menu after clicking a link
    if (isMenuOpen) {
        setIsMenuOpen(false);
    }
  };

  type NavLinkProps = React.PropsWithChildren<{ href: string; mode?: 'dark' | 'light' }>;

  const DesktopNavLink = ({ href, children, mode = 'dark' }: NavLinkProps) => (
    <li role="none">
      <a href={href} onClick={handleNavLinkClick} role="menuitem" className={`block px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 relative group ${mode === 'dark' ? 'text-zinc-700 hover:text-[var(--primary-dark)]' : 'text-white'}`}>
        {children}
         <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-1/2 transition-all duration-300 ${mode === 'light' ? 'bg-white' : 'bg-[var(--primary)]'}`}></span>
      </a>
    </li>
  );

  const MobileNavLink: React.FC<React.PropsWithChildren<{ href: string }>> = ({ href, children }) => (
    <li role="none">
      <a
        href={href}
        onClick={handleNavLinkClick}
        role="menuitem"
        className="block px-4 py-3 rounded-lg font-semibold text-zinc-700 hover:text-[var(--primary-dark)] transition-colors duration-200"
      >
        {children}
      </a>
    </li>
  );

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2 bg-white/80 backdrop-blur-xl shadow-md border-b border-zinc-200/50' : 'py-4 bg-transparent'}`}>
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center">
            <a href="#hero" onClick={handleNavLinkClick} aria-label="Taazabites - Go to homepage" className="flex items-center gap-2 text-2xl sm:text-3xl font-bold font-iowan transition-colors duration-300">
              <span className={isScrolled ? 'text-[var(--primary)]' : 'text-white'}>taaza</span>
              <span className={isScrolled ? 'text-[var(--accent-secondary)]' : 'text-white'}>bites</span>
              <sup className={`text-xs top-[-1em] ${isScrolled ? 'text-zinc-500' : 'text-white/80'}`}>™</sup>
            </a>
            <ul className="hidden lg:flex items-center gap-2" role="menubar" aria-label="Main navigation">
              <DesktopNavLink href="#hero" mode={isScrolled ? 'dark' : 'light'}>Home</DesktopNavLink>
              <DesktopNavLink href="#how-it-works" mode={isScrolled ? 'dark' : 'light'}>How It Works</DesktopNavLink>
              <DesktopNavLink href="#menu" mode={isScrolled ? 'dark' : 'light'}>Menu</DesktopNavLink>
              <DesktopNavLink href="#subscriptions" mode={isScrolled ? 'dark' : 'light'}>Subscriptions</DesktopNavLink>
              <DesktopNavLink href="#corporate-booking" mode={isScrolled ? 'dark' : 'light'}>Corporate</DesktopNavLink>
              <DesktopNavLink href="#testimonials" mode={isScrolled ? 'dark' : 'light'}>Reviews</DesktopNavLink>
              <DesktopNavLink href="#meal-planner" mode={isScrolled ? 'dark' : 'light'}>AI Planner</DesktopNavLink>
            </ul>
            <div className="flex items-center gap-4">
              <a href="https://taazabites.in/menu" target="_blank" rel="noopener noreferrer" aria-label="Order Now, opens in a new tab" className={`hidden lg:inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 ripple-effect ${isScrolled ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white shadow-[var(--primary)]/30' : 'bg-white text-[var(--primary-dark)] shadow-md'}`}>
                <i className="fas fa-shopping-cart" aria-hidden="true"></i> Order Now
              </a>
              <button onClick={toggleMenu} className={`lg:hidden text-2xl z-50 p-2 transition-colors duration-300 ${isScrolled || isMenuOpen ? 'text-[var(--primary-dark)]' : 'text-white'}`} aria-label="Toggle menu" aria-expanded={isMenuOpen} aria-controls="mobile-menu">
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true"></i>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={toggleMenu}
        aria-hidden="true"
      ></div>

      {/* Mobile Menu Panel */}
      <div id="mobile-menu" className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out lg:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="pt-24 px-6">
          <ul className="flex flex-col gap-2" role="menu" aria-label="Mobile navigation">
            <MobileNavLink href="#hero">Home</MobileNavLink>
            <MobileNavLink href="#how-it-works">How It Works</MobileNavLink>
            <MobileNavLink href="#menu">Menu</MobileNavLink>
            <MobileNavLink href="#subscriptions">Subscriptions</MobileNavLink>
            <MobileNavLink href="#corporate-booking">Corporate</MobileNavLink>
            <MobileNavLink href="#testimonials">Reviews</MobileNavLink>
            <MobileNavLink href="#meal-planner">AI Planner</MobileNavLink>
            <MobileNavLink href="#faq">FAQ</MobileNavLink>
          </ul>
          <div className="mt-8">
            <a href="https://taazabites.in/menu" target="_blank" rel="noopener noreferrer" aria-label="Order Now, opens in a new tab" className="w-full inline-flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-full shadow-lg bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] text-white shadow-[var(--primary)]/30 ripple-effect">
              <i className="fas fa-shopping-cart" aria-hidden="true"></i> Order Now
            </a>
          </div>
        </nav>
      </div>
    </>
  );
};
