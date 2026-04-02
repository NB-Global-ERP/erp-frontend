import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TabType = 'dashboard' | 'budget' | 'gantt' | 'employees' | 'settings';

interface UIState {
    sidebarOpen: boolean;
    activeTab: TabType;
    filters: {
        department: string | null;
        dateRange: { start: Date; end: Date };
    };
    toggleSidebar: () => void;
    setActiveTab: (tab: TabType) => void;
    setFilters: (filters: Partial<UIState['filters']>) => void;
    resetFilters: () => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            sidebarOpen: true,
            activeTab: 'budget',
            filters: {
                department: null,
                dateRange: {
                    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                    end: new Date(),
                },
            },
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setActiveTab: (tab) => set({ activeTab: tab }),
            setFilters: (newFilters) =>
                set((state) => ({
                    filters: { ...state.filters, ...newFilters },
                })),
            resetFilters: () =>
                set({
                    filters: {
                        department: null,
                        dateRange: {
                            start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                            end: new Date(),
                        },
                    },
                }),
        }),
        {
            name: 'ui-storage',
            partialize: (state) => ({
                filters: state.filters,
                activeTab: state.activeTab,
            }),
        }
    )
);