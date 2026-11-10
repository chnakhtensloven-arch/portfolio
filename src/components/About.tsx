import React, { useRef, useState } from 'react';
import { Language } from '../types/portfolio';
import { PERSONAL_INFO } from '../data/portfolioData';
import { t } from '../data/translations';
import { ArrowRight, MapPin } from 'lucide-react';

interface AboutProps {
  lang: Language;
}

export const About: React.FC<AboutProps> = ({ lang }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setRotate({
      x: -ny * 10,
      y: nx * 10
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <section id="about" className="py-16 space-y-12 relative">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#F8DD1B]">
          {t('About Me', lang)}
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white">
          <span>{t('Web Developer &', lang)} </span>
          <span className="text-[#F5CE0D] text-glow-subtle">
            {t('Meta Ads Specialist', lang)}
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Interactive 3D Tilt Portrait Box */}
        <div className="lg:col-span-5">
          <div
            ref={cardRef}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={handlePointerLeave}
            style={{
              transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(${isHovered ? -6 : 0}px)`,
              transition: isHovered
                ? 'transform 80ms ease-out'
                : 'transform 450ms cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
            className="group relative rounded-3xl bg-[#181c22] border border-[#2E3137] p-5 shadow-2xl hover:border-[#F8DD1B]/60 hover:shadow-[0_20px_50px_rgba(245,206,13,0.18)] preserve-3d"
          >
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#121519]">
              <img
                src={PERSONAL_INFO.images.about}
                alt={PERSONAL_INFO.fullName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.tried) {
                    target.dataset.tried = 'true';
                    target.src = PERSONAL_INFO.images.aboutFallback;
                  }
                }}
              />

              {/* Gradient Scrim & Status Pill */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent flex items-end p-6">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-200 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[#F8DD1B]" />
                    <span>{t('Algeria · Remote Global', lang)}</span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F8DD1B]/15 text-[#F8DD1B] border border-[#F8DD1B]/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F8DD1B] animate-pulse"></span>
                    <span>{t('Active', lang)}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Narrative Biography & 4 Quantitative Metric Cards */}
        <div className="lg:col-span-7 space-y-6">
          <p className="text-gray-200 text-base md:text-lg leading-relaxed font-normal">
            {t(
              'I am a passionate digital creator combining technical web development with strategic e-commerce marketing. With a deep understanding of consumer behavior and modern web technologies, I help brands establish a powerful online presence and scale their revenue.',
              lang
            )}
          </p>

          <p className="text-[#86898B] text-sm md:text-base leading-relaxed">
            {t(
              'From crafting bespoke, fast-loading e-commerce platforms to launching high-ROI Meta (Facebook & Instagram) ad campaigns, my focus is always on delivering measurable business growth.',
              lang
            )}
          </p>

          {/* 4 Quantitative Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            {PERSONAL_INFO.metrics.map((metric, i) => (
              <div
                key={i}
                className="group/stat rounded-2xl bg-[#181c22] border border-[#2E3137] p-4 text-center hover:border-[#F8DD1B]/60 hover:bg-[#20252d] transition duration-300 shadow-md"
              >
                <div className="text-3xl font-black text-[#F8DD1B] mb-1 font-mono tracking-tight group-hover/stat:scale-105 transition-transform">
                  {metric.value}
                </div>
                <div className="text-[11px] text-[#86898B] font-medium uppercase tracking-wider">
                  {t(metric.labelKey, lang)}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 text-[#F5CE0D] hover:text-[#F8DD1B] font-bold text-sm group transition-colors"
            >
              <span>{t('View My Work', lang)}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform rtl:group-hover:-translate-x-1.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
