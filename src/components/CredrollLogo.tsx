import React from 'react';

interface CredrollLogoProps {
  variant?: 'white' | 'crimson' | 'dark' | 'auto';
  showText?: boolean;
  textClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CredrollLogo: React.FC<CredrollLogoProps> = ({
  variant = 'crimson',
  showText = true,
  textClassName = '',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-lg font-bold' },
    md: { icon: 'w-9 h-9', text: 'text-xl font-bold tracking-tight' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl font-bold tracking-tight' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl font-extrabold tracking-tight' },
  };

  const getColors = () => {
    switch (variant) {
      case 'white':
        return {
          p1: '#FFFFFF',
          p2: 'rgba(255, 255, 255, 0.85)',
          p3: 'rgba(255, 255, 255, 0.7)',
          p4: 'rgba(255, 255, 255, 0.95)',
          text: 'text-white',
        };
      case 'dark':
        return {
          p1: '#0F172A',
          p2: '#334155',
          p3: '#475569',
          p4: '#1E293B',
          text: 'text-slate-900',
        };
      case 'crimson':
      default:
        return {
          p1: '#E11D48', // rose-600
          p2: '#BE123C', // rose-700
          p3: '#9F1239', // rose-800
          p4: '#F43F5E', // rose-500
          text: 'text-slate-900',
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Credroll Geometric Origami Polygon Icon */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeMap[size].icon} shrink-0 drop-shadow-xs transition-transform duration-200 hover:scale-105`}
      >
        {/* Top left polygon */}
        <polygon points="10,10 60,10 35,45 10,45" fill={colors.p1} />
        {/* Central folded faceted polygon */}
        <polygon points="35,45 60,10 85,55 50,60" fill={colors.p2} />
        {/* Left lower wing */}
        <polygon points="10,45 35,45 25,85 10,70" fill={colors.p3} />
        {/* Right forward triangle arrow */}
        <polygon points="50,60 85,55 95,88 35,88" fill={colors.p4} />
      </svg>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`${sizeMap[size].text} ${colors.text} ${textClassName}`}>
            Credroll
          </span>
          {size === 'xl' && (
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Credit Union
            </span>
          )}
        </div>
      )}
    </div>
  );
};
