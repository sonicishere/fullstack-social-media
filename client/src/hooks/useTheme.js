import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, setTheme } from '../features/theme/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  const handleSetTheme = (theme) => {
    dispatch(setTheme(theme));
  };

  return { theme: mode, toggleTheme: handleToggle, setTheme: handleSetTheme };
};
