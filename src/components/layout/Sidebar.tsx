import { Home, Calendar, Users } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/utils/formatters';

const menuItems = [
    { icon: Home, label: 'Дашборд', key: 'dashboard' },
    { icon: Calendar, label: 'Планирование', key: 'gantt' },
    { icon: Users, label: 'Группы', key: 'groups' },
];

export function Sidebar() {
    const sidebarOpen = useUIStore((state) => state.sidebarOpen);
    const activeTab = useUIStore((state) => state.activeTab);
    const setActiveTab = useUIStore((state) => state.setActiveTab);

    if (!sidebarOpen) return null;

    return (
        <aside className="fixed left-0 top-[72px] h-[calc(100vh-57px)] bg-white border-r border-gray-200 z-20">
            <nav className="p-4 flex flex-col gap-5 ">
                {menuItems.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setActiveTab(item.key as any)}
                        className={cn(
                            'flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-colors',
                            activeTab === item.key
                                ? 'bg-primary-50 text-primary'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        )}
                    >
                        <item.icon className="w-10 h-10" />
                    </button>
                ))}
            </nav>
        </aside>
    );
}