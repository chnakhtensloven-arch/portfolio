import React, { useEffect, useState } from 'react';
import { Language } from '../types/portfolio';

interface ScrollProgressBarProps {
  lang: Language;
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({ lang }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollHeight > 0) {
        const currentProgress = Math.min(Math.max(scrollTop / scrollHeight, 0), 1);
        setProgress(currentProgress * 100);
      } else {
        setProgress(0);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const isRtl = lang === 'ar';

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none"
      aria-hidden="true"
    >
      {/* Background Track (Subtle dark hairline guide) */}
      <div className="absolute inset-0 bg-[#121519]/50 backdrop-blur-[2px]" />

      {/* Animated Glowing Progress Bar */}
      <div
        className="relative h-full transition-[width] duration-150 ease-out"
        style={{
          width: `${progress}%`,
          marginLeft: isRtl ? 'auto' : 0,
          marginRight: isRtl ? 0 : 'auto',
          background: 'linear-gradient(90deg, #DDAC0D 0%, #F5CE0D 50%, #F8DD1B 100%)',
          boxShadow: '0 0 14px rgba(248, 221, 27, 0.75), 0 0 28px rgba(245, 206, 13, 0.45)'
        }}
      >
        {/* Animated Shimmer Wave Effect */}
        <div
          className="absolute inset-0 opacity-60 animate-[shimmer_2s_infinite_linear]"
          style={{
            backgroundImage:
              'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.7) 50%, transparent 100%)',
            backgroundSize: '200% 100%'
          }}
        />

        {/* Leading Tip Glowing Flare */}
        {progress > 1 && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#FFFFFF] shadow-[0_0_12px_#F8DD1B,0_0_24px_#F5CE0D] ${
              isRtl ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'
            }`}
          />
        )}
      </div>
    </div>
  );
};
