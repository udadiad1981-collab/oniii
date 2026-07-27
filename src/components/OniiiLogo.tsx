"use client";

interface OniiiLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function OniiiLogo({ size = 48, showText = true, className }: OniiiLogoProps) {
  // Only use light color by default, dark theme handled via CSS
  const isLight = true;

  return (
    <svg width={showText ? size * 2.5 : size} height={size} viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Icon - Stylized Chinese knot/circle with modern touch */}
      <g>
        {/* Outer ring gradient effect */}
        <circle cx="24" cy="24" r="20" stroke={isLight ? "#1a1a1a" : "#fff"} strokeWidth="2" fill="none"/>
        <circle cx="24" cy="24" r="16" stroke="#d4af37" strokeWidth="1.5" fill="none"/>
        
        {/* Chinese-inspired pattern - simplified knot element */}
        <path d="M24 10a6 6 0 100 12 6 6 0 000-12zM24 26a6 6 0 100 12 6 6 0 000-12zM18 18a6 6 0 100 12 6 6 0 000-12zM30 18a6 6 0 100 12 6 6 0 000-12z" 
              fill="#d4af37"/>
        
        {/* Subtle sparkles */}
        <circle cx="40" cy="16" r="1.5" fill="#d4af37" opacity="0.6"/>
        <circle cx="16" cy="28" r="1.5" fill="#d4af37" opacity="0.6"/>
      </g>

      {/* Brand name */}
      {showText && (
        <g transform="translate(50, 14)">
          {/* "ONIII" text */}
          <text x="0" y="32" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="32" fontWeight="700" fill={isLight ? "#1a1a1a" : "#fff"} letterSpacing="4">
            ONIII
          </text>
          <line y1="-2" x2="60" stroke="#d4af37" strokeWidth="2"/>
        </g>
      )}
    </svg>
  );
}
