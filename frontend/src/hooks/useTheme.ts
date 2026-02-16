import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

export function useTheme() {
    const theme = useSelector((state: RootState) => state.ui.theme);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    return theme;
}
