import { Menu } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

export function Header() {
    const toggleSidebar = useUIStore((state) => state.toggleSidebar);

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Menu className="w-10 h-10 text-gray-700" />
                    </button>
                    <h1 className="text-[28px] font-semibold text-gray-700">
                        Центр развития персонала
                    </h1>
                </div>
            </div>
        </header>
    );
}