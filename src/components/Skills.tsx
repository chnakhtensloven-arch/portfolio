import React, { useState } from 'react';
import { Language } from '../types/portfolio';
import { SKILLS_DATA } from '../data/portfolioData';
import { t } from '../data/translations';
import { SkillOrb3D } from './3d/SkillOrb3D';
import { Laptop, TrendingUp, Sparkles, BarChart2 } from 'lucide-react';

interface SkillsProps {
  lang: Language;
}

export const Skills: React.FC<SkillsProps> = ({ lang }) => {
  const [viewMode, setViewMode] = useState<'bars' | '3d'>('bars');

  const techSkills = SKILLS_DATA.filter((s) => s.category === 'tech');
  const marketingSkills = SKILLS_DATA.filter((s) => s.category === 'marketing');

  return (
    <section id="skills" className="py-16 space-y-12 relative">
      {/* Section Header with View Mode Switcher */}
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#F8DD1B]">
          {t('My Arsenal', lang)}
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white">
          <span>{t('My', lang)} </span>
          <span className="text-[#F5CE0D] text-glow-subtle">
            {t('Skills', lang)}
          </span>
        </h2>

        {/* 3D View Toggle Pill */}
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#181c22] border border-[#2E3137] shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode('bars')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              viewMode === 'bars'
                ? 'bg-[#F5CE0D] text-black shadow-md'
                : 'text-[#86898B] hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{t('Progress Bars', lang)}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              viewMode === '3d'
                ? 'bg-[#F5CE0D] text-black shadow-md'
                : 'text-[#86898B] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('Constellation View', lang)}</span>
          </button>
        </div>
      </div>

      {viewMode === '3d' ? (
        <div className="max-w-3xl mx-auto animate-fade-in">
          <SkillOrb3D lang={lang} />
        </div>
      ) : (
        /* 2-Column Responsive Skill Bars */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          {/* Card 1: Technical & Development */}
          <div className="rounded-3xl bg-[#181c22] border border-[#2E3137] p-8 space-y-6 hover:border-[#F8DD1B]/40 transition duration-300 shadow-lg">
            <div className="flex items-center gap-3 border-b border-[#2E3137] pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#F5CE0D]/15 flex items-center justify-center text-[#F8DD1B]">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {t('Technical & Development', lang)}
              </h3>
            </div>

            <div className="space-y-6">
              {techSkills.map((skill) => (
                <div key={skill.nameKey} className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-gray-200">{t(skill.nameKey, lang)}</span>
                    <span className="text-[#F8DD1B] font-mono">{skill.percentage}%</span>
                  </div>
                  <div className="w-full bg-[#121519] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#2E3137]">
                    <div
                      className="bg-gradient-to-r from-[#DDAC0D] via-[#F5CE0D] to-[#F8DD1B] h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(248,221,27,0.55)]"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Marketing & Meta Ads */}
          <div className="rounded-3xl bg-[#181c22] border border-[#2E3137] p-8 space-y-6 hover:border-[#F8DD1B]/40 transition duration-300 shadow-lg">
            <div className="flex items-center gap-3 border-b border-[#2E3137] pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#F5CE0D]/15 flex items-center justify-center text-[#F8DD1B]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {t('Marketing & Meta Ads', lang)}
              </h3>
            </div>

            <div className="space-y-6">
              {marketingSkills.map((skill) => (
                <div key={skill.nameKey} className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-gray-200">{t(skill.nameKey, lang)}</span>
                    <span className="text-[#F8DD1B] font-mono">{skill.percentage}%</span>
                  </div>
                  <div className="w-full bg-[#121519] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#2E3137]">
                    <div
                      className="bg-gradient-to-r from-[#DDAC0D] via-[#F5CE0D] to-[#F8DD1B] h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(248,221,27,0.55)]"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
