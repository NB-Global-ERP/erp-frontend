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
            <div className="flex w-full">
                <Sidebar />
                <main
                    className={cn(
                        'flex-1 transition-all duration-300',
                        sidebarOpen ? 'ml-24 w-[calc(100%-96px)]' : 'ml-0 w-full',
                    )}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}