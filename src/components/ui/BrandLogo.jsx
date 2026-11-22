import React from 'react';

/**
 * ResumeXpert AI Official Brand Logo Component.
 * Features high-contrast, crystal-clear typography paired with the official
 * vibrant 3D gradient X-mark logo icon.
 */
const BrandLogo = ({ 
  size = 'md', 
  variant = 'full', 
  showTagline = false,
  className = '' 
}) => {
  // Sizing definitions
  const iconHeights = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-12 sm:h-14',
    xl: 'h-14 sm:h-16',
    header: 'h-10 sm:h-11 md:h-12',
  };

  const textSizes = {
    sm: 'text-lg sm:text-xl',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
    header: 'text-xl sm:text-2xl',
  };

  const selectedIconHeight = iconHeights[size] || iconHeights.md;
  const selectedTextSize = textSizes[size] || textSizes.md;

  // Icon only
  if (variant === 'icon') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <img 
          src="/logo-icon.png" 
          alt="ResumeXpert AI" 
          className={`${selectedIconHeight} w-auto object-contain drop-shadow-sm`}
        />
      </div>
    );
  }

  // Pre-rendered banner image only
  if (variant === 'image') {
    return (
      <div className={`inline-flex flex-col items-start ${className}`}>
        <img 
          src="/resumexpert-logo-cropped.png" 
          alt="ResumeXpert AI — Build Smarter. Apply Better. Get Hired." 
          className="h-12 sm:h-14 md:h-16 w-auto max-w-none object-contain hover:scale-102 transition-transform duration-200"
        />
        {showTagline && (
          <span className="text-[11px] font-semibold text-[#6B7280] tracking-wide mt-1">
            Build Smarter. Apply Better. Get Hired.
          </span>
        )}
      </div>
    );
  }

  // Default 'full' variant: Crystal-clear official 3D Icon + Crisp High-DPI Typography
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 shrink-0 ${className}`}>
      {/* Official 3D Gradient Icon */}
      <img 
        src="/logo-icon.png" 
        alt="ResumeXpert AI Icon" 
        className={`${selectedIconHeight} w-auto object-contain shrink-0 drop-shadow-sm hover:scale-105 transition-transform duration-200`}
      />

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none select-none">
        <div className="flex items-center gap-1.5">
          <span className={`${selectedTextSize} font-black tracking-tight text-[#111827]`}>
            ResumeXpert
          </span>
          <span className={`${selectedTextSize} font-black bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#6335F5] bg-clip-text text-transparent`}>
            AI
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#6B7280] tracking-wide mt-1">
            Build Smarter. Apply Better. Get Hired.
          </span>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
