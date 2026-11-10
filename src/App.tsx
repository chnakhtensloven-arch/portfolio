import React, { useState, useEffect } from 'react';
import { Language } from './types/portfolio';
import { Navbar } from './components/Navbar';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('portfolio-language');
      return saved === 'ar' ? 'ar' : 'en';
    } catch {
      return 'en';
    }
  });

  const [prefilledSubject, setPrefilledSubject] = useState('');

  // Handle RTL and language attribute
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try {
      localStorage.setItem('portfolio-language', lang);
    } catch {
      // Storage unavailable fallback
    }
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const handleOrderService = (serviceTitle: string) => {
    setPrefilledSubject(`Inquiry for: ${serviceTitle}`);
    const el = document.getElementById('contact');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOrderProject = (projectTitle: string) => {
    setPrefilledSubject(`Order similar project: ${projectTitle}`);
    const el = document.getElementById('contact');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#121519] text-[#f3f4f6] selection:bg-[#F8DD1B] selection:text-black overflow-x-hidden relative">
      {/* Ambient Radial Gradients */}
      <div
        className="fixed inset-0 pointer-events-none z-0 ambient-mesh opacity-90"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <ScrollProgressBar lang={lang} />
        <Navbar lang={lang} onToggleLanguage={toggleLanguage} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 space-y-24 sm:space-y-32 pb-16">
          <Hero
            lang={lang}
            colorTheme="amber"
          />

          <About lang={lang} />
          <Services lang={lang} onSelectService={handleOrderService} />
          <Skills lang={lang} />
          <Projects lang={lang} onOrderProject={handleOrderProject} />
          <Contact lang={lang} prefilledSubject={prefilledSubject} />
        </main>

        <Footer lang={lang} />
      </div>
    </div>
  );
}
