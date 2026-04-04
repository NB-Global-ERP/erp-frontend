import { MainLayout } from '@/components/layout/MainLayout';
import { useUIStore } from '@/stores/uiStore';
import { Dashboard } from '@/components/erp/Dashboard';
import { TrainingGroups } from '@/components/erp/TrainingGroups';
import { TrainingGantt } from '@/components/erp/TrainingGantt';
import { Specifications } from '@/components/erp/Specifications';
import { Courses } from '@/components/erp/Courses';
import { Employees } from '@/components/erp/Employees';
import { Companies } from "@/components/erp/Companies.tsx";
import { useState } from 'react';

const tabs = [
    { id: 'dashboard', label: 'Дашборд', component: Dashboard },
    { id: 'gantt', label: 'Гант', component: TrainingGantt },
    { id: 'groups', label: 'Группы', component: TrainingGroups },
    { id: 'specifications', label: 'Спецификации', component: Specifications },
    { id: 'courses', label: 'Курсы', component: Courses },
    { id: 'employees', label: 'Сотрудники', component: Employees },
    { id: 'companies', label: 'Компании', component: Companies },
];

function App() {
    const activeTab = useUIStore((state) => state.activeTab);
    const setActiveTab = useUIStore((state) => state.setActiveTab);
    const [isChanging, setIsChanging] = useState(false);

    const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || Dashboard;

    const handleTabChange = (tabId: string) => {
        setIsChanging(true);
        setActiveTab(tabId as any);
        setTimeout(() => setIsChanging(false), 200);
    };

    return (
        <MainLayout>
            <div className="p-6">
                <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`
                                relative px-4 py-2 font-medium transition-colors duration-200 rounded-t-lg
                                hover:bg-gray-50
                                ${activeTab === tab.id
                                ? 'text-primary-600 bg-primary-50'
                                : 'text-gray-500'
                            }
                            `}
                        >
                            {tab.label}
                            <span
                                className={`
                                    absolute bottom-0 h-0.5 bg-primary-500 transition-all duration-300 ease-out
                                    ${activeTab === tab.id ? 'w-full left-0' : 'w-0 left-1/2'}
                                `}
                                style={{
                                    transform: activeTab === tab.id
                                        ? 'translateX(0)'
                                        : 'translateX(-50%)',
                                }}
                            />
                        </button>
                    ))}
                </div>

                <ActiveComponent />
            </div>
        </MainLayout>
    );
}

export default App;