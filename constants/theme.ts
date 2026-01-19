/**
 * Neon Cyberpunk Theme
 * High contrast, vibrant colors, glowing effects
 */

const tintColorLight = '#00f2ff';
const tintColorDark = '#00f2ff';

export const Colors = {
  light: {
    // Light mode will still be bold but readable
    text: '#09090b',
    background: '#ffffff',
    tint: '#7c3aed',
    icon: '#18181b',
    tabIconDefault: '#71717a',
    tabIconSelected: '#7c3aed',
    card: '#f4f4f5',
    border: '#e4e4e7',
    
    // Neon Accents (dimmed for light mode)
    primary: '#7c3aed', // Electric Purple
    secondary: '#06b6d4', // Cyan
    tertiary: '#f472b6', // Pink
    accent: '#09090b',
    highlight: '#f3e8ff',
    
    // Neon specifics
    neonBlue: '#06b6d4',
    neonPink: '#ec4899',
    neonGreen: '#10b981',
    neonYellow: '#f59e0b',
    glow: 'rgba(124, 58, 237, 0.3)',
  },
  dark: {
    // The main event: Cyberpunk Dark Mode
    text: '#ffffff',
    background: '#050505', // Almost pitch black
    tint: tintColorDark,
    icon: '#a1a1aa',
    tabIconDefault: '#52525b',
    tabIconSelected: '#00f2ff',
    card: '#0a0a0a', // Slightly lighter black
    border: '#27272a',
    
    // Vibrant Neon Accents
    primary: '#8b5cf6', // Electric Purple
    secondary: '#00f2ff', // Cyber Blue
    tertiary: '#ff00ff', // Hot Pink
    accent: '#ffffff',
    highlight: '#18181b',
    
    // Neon specifics
    neonBlue: '#00f2ff',
    neonPink: '#ff00ff',
    neonGreen: '#39ff14',
    neonYellow: '#ffff00',
    glow: 'rgba(0, 242, 255, 0.5)',
  },
};
