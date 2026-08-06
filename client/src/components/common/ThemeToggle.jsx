import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
      <div className="theme-toggle-slider" />
      <FiMoon className="theme-toggle-icon" style={{ color: theme === 'dark' ? '#fff' : '#8b8b9e' }} />
      <FiSun className="theme-toggle-icon" style={{ color: theme === 'light' ? '#fff' : '#8b8b9e' }} />
    </button>
  );
};

export default ThemeToggle;
