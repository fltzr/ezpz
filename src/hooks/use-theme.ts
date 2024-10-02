import { applyMode, Mode } from '@cloudscape-design/global-styles';
import { useEffect, useState } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<Mode>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? (savedTheme as Mode) : Mode.Dark;
  });

  useEffect(() => {
    applyMode(theme);
    document.body.classList.toggle('awsui-dark-mode', theme === Mode.Dark);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return {
    theme,
    toggleTheme: () => setTheme((prev) => (prev === Mode.Dark ? Mode.Light : Mode.Dark)),
  };
};
