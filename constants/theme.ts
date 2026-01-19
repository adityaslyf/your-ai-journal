/**
 * Pastel Theme inspired by the reference images
 */

const tintColorLight = '#1C1C1E'; // Dark text for active tab in light mode
const tintColorDark = '#FFFFFF';

export const Colors = {
  light: {
    text: '#1C1C1E',
    background: '#F2F2F7', // Light gray background
    tint: tintColorLight,
    icon: '#8E8E93',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    border: '#E5E5EA',
    
    // Custom Palette
    primary: '#9D8BF5', // The Purple from the header
    secondary: '#C5F2C7', // The Green from the cards
    tertiary: '#FFE4C0', // A soft yellow/orange for variety
    accent: '#1C1C1E', // Dark accent for buttons/tab bar
    highlight: '#F4F3FF', // Very light purple for backgrounds
  },
  dark: {
    text: '#F2F2F7',
    background: '#000000',
    tint: tintColorDark,
    icon: '#8E8E93',
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorDark,
    card: '#1C1C1E',
    border: '#2C2C2E',
    
    primary: '#9D8BF5',
    secondary: '#C5F2C7',
    tertiary: '#FFE4C0',
    accent: '#FFFFFF',
    highlight: '#1C1C1E',
  },
};
