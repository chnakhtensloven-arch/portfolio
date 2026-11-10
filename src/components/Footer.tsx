import React from 'react';
import { Language } from '../types/portfolio';
import { PERSONAL_INFO } from '../data/portfolioData';
import { t } from '../data/translations';
import { Github, Linkedin, Phone, Instagram } from 'lucide-react';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="border-t border-[#2E3137] py-10 bg-[#121519]/90 mt-24">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#86898B]">
        {/* Brand & Copyright */}
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-[#F8DD1B] to-[#F5CE0D]">
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
          <p>
            <span>{t('Copyright © 2026 by', lang)} </span>
            <strong className="text-gray-200 font-semibold">{PERSONAL_INFO.fullName}</strong>
            <span> {t('| All Rights Reserved.', lang)}</span>
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-5">
          <a
            href={PERSONAL_INFO.social.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-[#86898B] hover:text-[#F8DD1B] transition"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-[#86898B] hover:text-[#F8DD1B] transition"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.social.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="text-[#86898B] hover:text-[#F8DD1B] transition"
          >
            <Phone className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-[#86898B] hover:text-[#F8DD1B] transition"
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};
