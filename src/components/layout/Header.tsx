import { Menu, Bell } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';

export function Header() {
    const toggleSidebar = useUIStore((state) => state.toggleSidebar);

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Menu className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-semibold text-gray-800">
                        ERP Learning Platform
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>
            </div>
        </header>
    );
}