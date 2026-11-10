import React from 'react';
import { Language } from '../types/portfolio';
import { SERVICES_DATA } from '../data/portfolioData';
import { t } from '../data/translations';
import { Code, ShoppingCart, TrendingUp, Check, ArrowRight } from 'lucide-react';

interface ServicesProps {
  lang: Language;
  onSelectService: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ lang, onSelectService }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Code':
        return <Code className="w-6 h-6" />;
      case 'ShoppingCart':
        return <ShoppingCart className="w-6 h-6" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6" />;
      default:
        return <Code className="w-6 h-6" />;
    }
  };

  return (
    <section id="services" className="py-16 space-y-12 relative">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#F8DD1B]">
          {t('What I Do', lang)}
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white">
          <span>{t('My', lang)} </span>
          <span className="text-[#F5CE0D] text-glow-subtle">
            {t('Services', lang)}
          </span>
        </h2>
        <p className="text-[#86898B] text-sm max-w-md mx-auto leading-relaxed">
          {t(
            'Specialized solutions designed to convert traffic into measurable revenue.',
            lang
          )}
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {SERVICES_DATA.map((service) => {
          const isPopular = service.isPopular;

          return (
            <div
              key={service.id}
              className={`group relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 ${
                isPopular
                  ? 'bg-[#1c2128] border-2 border-[#F8DD1B] shadow-[0_0_35px_-4px_rgba(248,221,27,0.4)]'
                  : 'bg-[#181c22] border border-[#2E3137] hover:border-[#F8DD1B]/60 hover:shadow-[0_15px_30px_rgba(245,206,13,0.15)]'
              }`}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-[#F8DD1B] text-black font-black text-[11px] uppercase tracking-wider shadow-md">
                  {t('Most Popular', lang)}
                </div>
              )}

              <div className="space-y-6">
                {/* Icon Box */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-[#F8DD1B] text-2xl transition duration-300 group-hover:scale-110 ${
                    isPopular
                      ? 'bg-[#F5CE0D]/20 border border-[#F8DD1B]/40'
                      : 'bg-[#121519] border border-[#2E3137]'
                  }`}
                >
                  {getIcon(service.icon)}
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white group-hover:text-[#F8DD1B] transition-colors">
                    {t(service.titleKey, lang)}
                  </h3>
                  <p className="text-[#86898B] text-sm leading-relaxed">
                    {t(service.descriptionKey, lang)}
                  </p>
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 text-sm text-gray-300 pt-2 border-t border-[#2E3137]">
                  {service.featuresKeys.map((featKey) => (
                    <li key={featKey} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#F5CE0D]/15 flex items-center justify-center text-[#F8DD1B] shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium">
                        {t(featKey, lang)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <a
                  href="#contact"
                  onClick={() => onSelectService(t(service.titleKey, lang))}
                  className={`w-full py-3.5 rounded-full text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                    isPopular
                      ? 'bg-[#F5CE0D] hover:bg-[#F8DD1B] text-black shadow-[0_0_20px_rgba(245,206,13,0.4)]'
                      : 'bg-[#121519] hover:bg-[#F5CE0D] text-white hover:text-black border border-[#2E3137]'
                  }`}
                >
                  <span>{t('Order Service', lang)}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
