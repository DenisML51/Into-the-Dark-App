import React from 'react';
import * as LucideIcons from 'lucide-react';

/**
 * Registry for custom SVG icons.
 * You can add your custom icons here.
 * Make sure they use `currentColor` for stroke or fill to support dynamic coloring.
 */
export const CUSTOM_ICONS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  'Pentagram': (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2L9 9H2L8 14L5 21L12 17L19 21L16 14L22 9H15L12 2Z" />
    </svg>
  ),
  'BookMagic': (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M12 6v6" />
      <path d="M9 9h6" />
    </svg>
  ),
};

export const getLucideIcon = (iconName: string, props?: any) => {
  // Check if it's a custom icon first
  const CustomIcon = CUSTOM_ICONS[iconName];
  if (CustomIcon) {
    // Standard size for custom icons if not provided
    const size = props?.size || 24;
    return <CustomIcon width={size} height={size} {...props} />;
  }

  // Fallback to Lucide icons
  const Icon = (LucideIcons as any)[iconName];
  if (!Icon) {
    return <LucideIcons.Circle {...props} />;
  }
  return <Icon {...props} />;
};

/**
 * Extended list of icons for pickers including custom ones
 */
export const ALL_AVAILABLE_ICONS = [
  // Custom icons IDs
  ...Object.keys(CUSTOM_ICONS),
  // Lucide icons used in pickers
  'Zap', 'Flame', 'Sparkles', 'Star', 'Sword', 'Shield', 'Swords', 'Axe', 
  'Heart', 'Brain', 'Eye', 'Droplet', 'Target', 'Activity', 'Circle', 
  'Square', 'Triangle', 'Diamond', 'Hexagon', 'Feather', 'Wind', 'CloudRain', 
  'Sun', 'Moon', 'CloudLightning', 'Snowflake', 'Skull', 'Ghost', 'Wand2', 
  'Gem', 'Crown', 'Bookmark', 'FlaskConical', 'Scroll', 'Ghost', 'Skull', 
  'Component', 'Dna', 'Magnet', 'Microscope', 'Palette'
];
