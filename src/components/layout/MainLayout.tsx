import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/utils/formatters';
import type {ReactNode} from "react";

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const sidebarOpen = useUIStore((state) => state.sidebarOpen);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
                <Sidebar />
                <main
                    className={cn(
                        'flex-1 transition-all duration-300',
                        sidebarOpen ? 'ml-32' : 'ml-0'
                    )}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}