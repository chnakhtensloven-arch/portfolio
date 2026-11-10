import React, { useState, useEffect } from 'react';
import { Language } from '../types/portfolio';
import { PERSONAL_INFO } from '../data/portfolioData';
import { t } from '../data/translations';
import { Hero3DCanvas } from './3d/Hero3DCanvas';
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  Instagram,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

interface HeroProps {
  lang: Language;
  colorTheme?: 'amber' | 'blue' | 'emerald';
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  colorTheme = 'amber'
}) => {
  const roles = [
    t('Web Developer', lang),
    t('Front-End Developer', lang),
    t('E-commerce Developer', lang),
    t('Meta Specialist', lang)
  ];

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState(roles[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const activeTarget = roles[currentRoleIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && currentText === activeTarget) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    } else {
      const delta = isDeleting ? 45 : 85;
      timeout = setTimeout(() => {
        setCurrentText((prev) =>
          isDeleting ? prev.slice(0, -1) : activeTarget.slice(0, prev.length + 1)
        );
      }, delta);
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentRoleIndex, lang]);

  return (
    <section id="home" className="relative pt-6 pb-16 lg:py-24 overflow-hidden">
      {/* Background Ambient Glow using user golden yellow palette */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#F8DD1B]/12 via-[#F5CE0D]/5 to-transparent rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Semantic Content & Action Controls */}
        <div className="lg:col-span-7 space-y-7 z-10">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#181c22]/90 border border-[#2E3137] text-xs font-bold text-gray-300 shadow-sm backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F8DD1B] animate-pulse"></span>
            <span className="tracking-wide">
              {t('AVAILABLE FOR HIGH-IMPACT PROJECTS', lang)}
            </span>
          </div>

          {/* Headline Group */}
          <div className="space-y-3">
            <p className="text-[#86898B] text-lg font-medium">
              {t("Hello, it's Me", lang)}
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
              {PERSONAL_INFO.name}{' '}
              <span className="text-[#F5CE0D] text-glow">
                {PERSONAL_INFO.lastName}
              </span>
            </h1>

            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-300 flex flex-wrap items-center gap-2">
              <span>{t("And I'm a", lang)}</span>
              <span className="text-[#F8DD1B] border-b-2 border-[#F8DD1B] pb-0.5 min-h-[36px] inline-flex items-center">
                {currentText}
                <span className="inline-block w-0.5 h-6 bg-[#F8DD1B] ml-1 animate-pulse" />
              </span>
            </h2>
          </div>

          {/* Bio Description */}
          <p className="text-gray-300 text-base md:text-lg max-w-xl leading-relaxed">
            <span>{t('Specialized in', lang)} </span>
            <strong className="text-white font-semibold">
              {t('Web Development', lang)}
            </strong>
            <span>{t(',', lang)} </span>
            <strong className="text-white font-semibold">
              {t('E-commerce Growth', lang)}
            </strong>
            <span>{t(', and', lang)} </span>
            <strong className="text-white font-semibold">
              {t('Meta Ads', lang)}
            </strong>
            <span>
              {t(
                '. I build high-converting digital experiences, scalable online stores, and data-driven advertising campaigns that drive real results.',
                lang
              )}
            </span>
          </p>

          {/* Social Icons Bar */}
          <div className="flex items-center gap-3 pt-2">
            <a
              id="github-link"
              href={PERSONAL_INFO.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('GitHub Profile', lang)}
              className="w-11 h-11 rounded-2xl bg-[#181c22] border border-[#2E3137] flex items-center justify-center text-[#86898B] hover:text-black hover:bg-[#F8DD1B] hover:border-[#F8DD1B] transition duration-300 hover:scale-110 shadow-sm"
            >
              <Github className="w-5 h-5" />
            </a>

            <a
              id="linkedin-link"
              href={PERSONAL_INFO.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('LinkedIn Profile', lang)}
              className="w-11 h-11 rounded-2xl bg-[#181c22] border border-[#2E3137] flex items-center justify-center text-[#86898B] hover:text-black hover:bg-[#F8DD1B] hover:border-[#F8DD1B] transition duration-300 hover:scale-110 shadow-sm"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            <a
              id="email-link"
              href={PERSONAL_INFO.social.email}
              aria-label={t('Direct Email', lang)}
              className="w-11 h-11 rounded-2xl bg-[#181c22] border border-[#2E3137] flex items-center justify-center text-[#86898B] hover:text-black hover:bg-[#F8DD1B] hover:border-[#F8DD1B] transition duration-300 hover:scale-110 shadow-sm"
            >
              <Mail className="w-5 h-5" />
            </a>

            <a
              id="whatsapp-link"
              href={PERSONAL_INFO.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('WhatsApp Contact', lang)}
              className="w-11 h-11 rounded-2xl bg-[#181c22] border border-[#2E3137] flex items-center justify-center text-[#86898B] hover:text-black hover:bg-[#F8DD1B] hover:border-[#F8DD1B] transition duration-300 hover:scale-110 shadow-sm"
            >
              <Phone className="w-5 h-5" />
            </a>

            <a
              id="instagram-link"
              href={PERSONAL_INFO.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('Instagram Profile', lang)}
              className="w-11 h-11 rounded-2xl bg-[#181c22] border border-[#2E3137] flex items-center justify-center text-[#86898B] hover:text-black hover:bg-[#F8DD1B] hover:border-[#F8DD1B] transition duration-300 hover:scale-110 shadow-sm"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="#about"
              className="px-8 py-4 rounded-full bg-[#F5CE0D] hover:bg-[#F8DD1B] text-black font-extrabold text-sm tracking-wide transition shadow-[0_0_25px_rgba(245,206,13,0.45)] hover:scale-105 active:scale-95 duration-200"
            >
              {t('More About Me', lang)}
            </a>
            <a
              href="#contact"
              className="px-8 py-4 rounded-full bg-[#181c22] hover:bg-[#2E3137] border border-[#2E3137] hover:border-[#3F4247] text-white font-semibold text-sm tracking-wide transition"
            >
              {t("Let's Talk", lang)}
            </a>
          </div>
        </div>

        {/* Right Column: Interactive 3D Canvas with Holographic Badges */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          {/* 3D Scene Viewport */}
          <div className="relative w-full aspect-square max-w-md lg:max-w-none">
            <Hero3DCanvas
              colorTheme={colorTheme}
              autoRotateSpeed={1}
              particlesEnabled={true}
            />

            {/* Central Holographic Avatar Portal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-b from-[#F8DD1B] via-[#2E3137] to-transparent shadow-[0_0_35px_rgba(248,221,27,0.45)] pointer-events-none">
              <div className="w-full h-full rounded-full overflow-hidden bg-black border-2 border-[#181c22]">
                <img
                  src={PERSONAL_INFO.images.avatar}
                  alt={PERSONAL_INFO.fullName}
                  className="w-full h-full object-cover scale-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.tried) {
                      target.dataset.tried = 'true';
                      target.src = PERSONAL_INFO.images.avatarFallback;
                    }
                  }}
                />
              </div>
            </div>

            {/* Floating 3D Stat Badge 1: ROAS */}
            <div className="absolute top-4 -right-2 sm:right-2 z-20 backdrop-blur-xl bg-[#181c22]/95 border border-[#2E3137] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 transform hover:scale-105 hover:border-[#F8DD1B]/60 transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-[#F5CE0D]/20 text-[#F8DD1B] flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-[#86898B] font-medium">
                  {t('Avg. Meta ROAS', lang)}
                </p>
                <p className="text-base font-black text-white font-mono">4.5x</p>
              </div>
            </div>

            {/* Floating 3D Stat Badge 2: Projects Done */}
            <div className="absolute -bottom-2 -left-2 sm:left-2 z-20 backdrop-blur-xl bg-[#181c22]/95 border border-[#2E3137] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 transform hover:scale-105 hover:border-[#F8DD1B]/60 transition duration-300">
              <div className="w-10 h-10 rounded-xl bg-[#F5CE0D]/20 text-[#F8DD1B] flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-[#86898B] font-medium">
                  {t('Projects Done', lang)}
                </p>
                <p className="text-base font-black text-white font-mono">50+</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
