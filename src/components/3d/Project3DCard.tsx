import React, { useRef, useState } from 'react';
import { ProjectData, Language } from '../../types/portfolio';
import { t } from '../../data/translations';
import { Layers, ArrowRight } from 'lucide-react';

interface Project3DCardProps {
  project: ProjectData;
  lang: Language;
  onSelect: (project: ProjectData) => void;
  index: number;
}

export const Project3DCard: React.FC<Project3DCardProps> = ({
  project,
  lang,
  onSelect,
  index
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = (x / rect.width) * 2 - 1;
    const normalizedY = (y / rect.height) * 2 - 1;

    setRotate({
      x: -normalizedY * 12,
      y: normalizedX * 12
    });

    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={() => onSelect(project)}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(${isHovered ? -8 : 0}px)`,
        transition: isHovered
          ? 'transform 100ms ease-out, box-shadow 200ms ease'
          : 'transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 500ms ease'
      }}
      className="group relative cursor-pointer rounded-3xl bg-[#181c22]/95 border border-[#2E3137] hover:border-[#F8DD1B]/70 p-1 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-[0_20px_50px_rgba(245,206,13,0.18)] preserve-3d"
    >
      {/* Dynamic Specular Glare Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-3xl"
        style={{
          background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(248, 221, 27, ${glarePos.opacity}), transparent 80%)`
        }}
      />

      {/* Card Header & Visual Media Showcase */}
      <div className="relative rounded-2xl overflow-hidden bg-[#121519] h-56 border border-[#2E3137]/60 preserve-3d">
        <img
          src={project.image}
          alt={t(project.imageAltKey, lang)}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.fallbackTried) {
              target.dataset.fallbackTried = 'true';
              if (project.id === 'luxury-store') target.src = '/assets/aistudio/e-commerc_7ed5a85c.jpg';
              if (project.id === 'meta-ads-campaign') target.src = '/assets/aistudio/meta-ads_9034b4a8.jpg';
              if (project.id === 'landing-page') target.src = '/assets/aistudio/leading-page_c1ae1ca7.jpg';
            }
          }}
        />

        {/* Ambient Dark Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121519] via-black/45 to-black/25" />

        {/* 3D Floating Project Label Badge */}
        {project.badge && (
          <div
            style={{ transform: 'translateZ(30px)' }}
            className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none"
          >
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] group-hover:text-[#F8DD1B] transition-colors duration-300">
              {project.badge.value}
            </span>
            <span className="text-xs uppercase tracking-widest text-[#86898B] font-semibold mt-1">
              {t(project.badge.labelKey, lang)}
            </span>
          </div>
        )}

        {/* Corner 3D Quick Action Icon */}
        <button
          type="button"
          aria-label={t('Inspect in 3D', lang)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(project);
          }}
          style={{ transform: 'translateZ(35px)' }}
          className="absolute top-3.5 right-3.5 w-10 h-10 rounded-full bg-[#121519]/80 backdrop-blur-md border border-[#2E3137] text-white hover:text-[#F8DD1B] hover:border-[#F8DD1B]/60 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Index counter */}
        <div
          style={{ transform: 'translateZ(25px)' }}
          className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-md bg-[#121519]/80 backdrop-blur-md border border-[#2E3137] text-[11px] font-mono font-bold text-[#86898B]"
        >
          0{index + 1}
        </div>
      </div>

      {/* Card Content & Information */}
      <div className="p-6 space-y-4 preserve-3d" style={{ transform: 'translateZ(20px)' }}>
        {/* Category Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {project.categoryKeys.map((catKey) => (
            <span
              key={catKey}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#2E3137]/60 text-gray-200 border border-[#3F4247] group-hover:border-[#F8DD1B]/40 transition-colors"
            >
              {t(catKey, lang)}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-[#F8DD1B] transition-colors">
          {t(project.titleKey, lang)}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#86898B] leading-relaxed line-clamp-2">
          {t(project.descriptionKey, lang)}
        </p>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2E3137]">
          {project.metrics.map((m, idx) => (
            <div key={idx} className="text-center p-2 rounded-xl bg-[#121519]/60 border border-[#2E3137]">
              <span className="block text-sm font-extrabold text-[#F8DD1B] font-mono">
                {m.value}
              </span>
              <span className="block text-[10px] text-[#86898B] truncate">
                {t(m.labelKey, lang)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Footer with CTA */}
      <div
        className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-[#2E3137] preserve-3d"
        style={{ transform: 'translateZ(25px)' }}
      >
        <span className="inline-flex items-center gap-2 text-xs font-bold text-[#F5CE0D] group-hover:text-[#F8DD1B] transition-colors">
          <span>{t('View Case Study', lang)}</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" />
        </span>

        <span className="text-[11px] font-medium text-[#86898B] flex items-center gap-1">
          <Layers className="w-3 h-3 text-[#F8DD1B]" />
          <span>3D View</span>
        </span>
      </div>
    </div>
  );
};
