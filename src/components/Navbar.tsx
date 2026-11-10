import React, { useState, useEffect } from 'react';
import { Language } from '../types/portfolio';
import { PERSONAL_INFO } from '../data/portfolioData';
import { t } from '../data/translations';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  lang: Language;
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ lang, onToggleLanguage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', labelKey: 'Home' },
    { href: '#about', labelKey: 'About' },
    { href: '#services', labelKey: 'Services' },
    { href: '#skills', labelKey: 'Skills' },
    { href: '#projects', labelKey: 'Projects' },
    { href: '#contact', labelKey: 'Contact' }
  ];

  return (
    <>
      <header
        id="navbar"
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#121519]/90 backdrop-blur-xl border-b border-[#2E3137] shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark with Avatar */}
          <a href="#home" className="flex items-center gap-3.5 group shrink-0">
            <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-[#F8DD1B] to-[#F5CE0D] group-hover:shadow-[0_0_20px_rgba(248,221,27,0.55)] transition duration-300">
              <img
                src={PERSONAL_INFO.images.avatar}
                alt={PERSONAL_INFO.fullName}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.tried) {
                    target.dataset.tried = 'true';
                    target.src = PERSONAL_INFO.images.avatarFallback;
                  }
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-[#F8DD1B] transition duration-200">
                {PERSONAL_INFO.name}{' '}
                <span className="text-[#F5CE0D] font-black">{PERSONAL_INFO.lastName}</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#86898B] font-semibold">
                {t(PERSONAL_INFO.taglineKey, lang)}
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#181c22]/90 px-4 py-1.5 rounded-full border border-[#2E3137] shadow-inner backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link px-4 py-2 text-sm font-medium text-gray-300 hover:text-[#F8DD1B] hover:bg-white/5 transition rounded-full whitespace-nowrap"
              >
                {t(link.labelKey, lang)}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary Action & Language Toggle */}
          <div className="flex items-center gap-3.5 shrink-0">
            {/* Language Switcher */}
            <button
              id="language-toggle"
              type="button"
              onClick={onToggleLanguage}
              aria-label={t(
                lang === 'ar' ? 'Switch language to English' : 'Switch language to Arabic',
                lang
              )}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181c22] border border-[#2E3137] hover:border-[#F8DD1B] text-xs font-bold text-gray-300 hover:text-white transition duration-200"
            >
              <span className={lang === 'ar' ? 'text-[#F8DD1B]' : 'text-[#86898B]'}>AR</span>
              <span className="text-[#3F4247]">/</span>
              <span className={lang === 'en' ? 'text-[#F8DD1B]' : 'text-[#86898B]'}>EN</span>
            </button>

            {/* Let's Talk CTA */}
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F5CE0D] hover:bg-[#F8DD1B] text-black font-extrabold text-sm transition shadow-[0_0_20px_rgba(245,206,13,0.45)] hover:scale-105 active:scale-95 duration-200"
            >
              <span>{t("Let's Talk", lang)}</span>
              <ArrowUpRight className="w-4 h-4 rtl:rotate-[-90deg]" />
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              id="menu-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={t('Toggle navigation menu', lang)}
              className="md:hidden w-10 h-10 rounded-xl bg-[#181c22] border border-[#2E3137] flex items-center justify-center text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#121519]/95 border-b border-[#2E3137] px-6 py-5 space-y-3 backdrop-blur-xl animate-fade-in">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-gray-200 hover:text-[#F8DD1B] py-2 border-b border-white/5"
              >
                {t(link.labelKey, lang)}
              </a>
            ))}
            <div className="pt-3">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-3 rounded-full bg-[#F5CE0D] hover:bg-[#F8DD1B] text-black font-extrabold text-sm"
              >
                {t("Let's Talk", lang)}
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
