import React, { useState } from 'react';
import { Language, ProjectData } from '../types/portfolio';
import { PROJECTS_DATA } from '../data/portfolioData';
import { t } from '../data/translations';
import { Project3DCard } from './3d/Project3DCard';
import { ProjectModal } from './3d/ProjectModal';

interface ProjectsProps {
  lang: Language;
  onOrderProject: (projectTitle: string) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ lang, onOrderProject }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filterTabs = [
    { id: 'all', labelKey: 'All Projects' },
    { id: 'Shopify', labelKey: 'Shopify' },
    { id: 'Meta Ads', labelKey: 'Meta Ads' },
    { id: 'HTML/CSS/JS', labelKey: 'LANDING PAGE' }
  ];

  const filteredProjects = PROJECTS_DATA.filter((project) => {
    if (activeFilter === 'all') return true;
    return project.categoryKeys.includes(activeFilter);
  });

  return (
    <section id="projects" className="py-16 space-y-12 relative">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#F8DD1B]">
          {t('Portfolio', lang)}
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white">
          <span>{t('Latest', lang)} </span>
          <span className="text-[#F5CE0D] text-glow-subtle">
            {t('Projects', lang)}
          </span>
        </h2>
        <p className="text-[#86898B] text-sm max-w-md mx-auto leading-relaxed">
          Interactive 3D case studies with verified business metrics and high ROAS results.
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#F5CE0D] text-black shadow-[0_0_15px_rgba(245,206,13,0.45)]'
                    : 'bg-[#181c22] text-[#86898B] hover:text-white border border-[#2E3137]'
                }`}
              >
                {t(tab.labelKey, lang)}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {filteredProjects.map((project, index) => (
          <Project3DCard
            key={project.id}
            project={project}
            lang={lang}
            index={index}
            onSelect={setSelectedProject}
          />
        ))}
      </div>

      {/* 3D Interactive Project Modal */}
      <ProjectModal
        project={selectedProject}
        lang={lang}
        onClose={() => setSelectedProject(null)}
        onOrderProject={onOrderProject}
      />
    </section>
  );
};
