import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

export type Theme = 'light' | 'dark';

interface CalendarFilters {
    statusId: number | null;
    categoryId: number | null;
}

interface UIState {
    sidebarCollapsed: boolean;
    selectedDate: string | null; // ISO date string YYYY-MM-DD
    selectedTaskId: number | null;
    currentMonth: string; // format YYYY-MM
    calendarFilters: CalendarFilters;
    rightPanelOpen: boolean;
    theme: Theme;
}

const initialState: UIState = {
    sidebarCollapsed: false,
    selectedDate: dayjs().format('YYYY-MM-DD'),
    selectedTaskId: null,
    currentMonth: dayjs().format('YYYY-MM'),
    calendarFilters: {
        statusId: null,
        categoryId: null,
    },
    rightPanelOpen: false,
    theme: 'dark',
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
        },
        setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
            state.sidebarCollapsed = action.payload;
        },
        setSelectedDate: (state, action: PayloadAction<string | null>) => {
            state.selectedDate = action.payload;
            state.selectedTaskId = null;
            state.rightPanelOpen = action.payload !== null;
        },
        setSelectedTaskId: (state, action: PayloadAction<number | null>) => {
            state.selectedTaskId = action.payload;
            state.rightPanelOpen = action.payload !== null;
        },
        setCurrentMonth: (state, action: PayloadAction<string>) => {
            state.currentMonth = action.payload;
        },
        setCalendarFilters: (state, action: PayloadAction<Partial<CalendarFilters>>) => {
            state.calendarFilters = { ...state.calendarFilters, ...action.payload };
        },
        clearCalendarFilters: (state) => {
            state.calendarFilters = { statusId: null, categoryId: null };
        },
        closeRightPanel: (state) => {
            state.rightPanelOpen = false;
            state.selectedTaskId = null;
        },
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload;
        },
        toggleTheme: (state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
        },
        resetUI: () => initialState,
    },
});

export const {
    toggleSidebar,
    setSidebarCollapsed,
    setSelectedDate,
    setSelectedTaskId,
    setCurrentMonth,
    setCalendarFilters,
    clearCalendarFilters,
    closeRightPanel,
    setTheme,
    toggleTheme,
    resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
