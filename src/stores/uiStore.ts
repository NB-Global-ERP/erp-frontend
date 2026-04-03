import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TabType = 'dashboard' | 'groups' | 'gantt' | 'specifications' | 'courses' | 'employees' | 'settings';

interface UIState {
    sidebarOpen: boolean;
    activeTab: TabType;
    toggleSidebar: () => void;
    setActiveTab: (tab: TabType) => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            sidebarOpen: true,
            activeTab: 'dashboard',
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setActiveTab: (tab) => set({ activeTab: tab }),
        }),
        {
            name: 'ui-storage',
            partialize: (state) => ({ activeTab: state.activeTab }),
        }
    )
);