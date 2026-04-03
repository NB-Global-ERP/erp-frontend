import { MainLayout } from '@/components/layout/MainLayout';
import { useUIStore } from '@/stores/uiStore';
import { Dashboard } from '@/components/erp/Dashboard';
import { TrainingGroups } from '@/components/erp/TrainingGroups';
import { TrainingGantt } from '@/components/erp/TrainingGantt';
import { Specifications } from '@/components/erp/Specifications';
import { Courses } from '@/components/erp/Courses';
import { Employees } from '@/components/erp/Employees';

const tabs = [
    { id: 'dashboard', label: 'Дашборд', component: Dashboard },
    { id: 'groups', label: 'Группы', component: TrainingGroups },
    { id: 'gantt', label: 'Гант', component: TrainingGantt },
    { id: 'specifications', label: 'Спецификации', component: Specifications },
    { id: 'courses', label: 'Курсы', component: Courses },
    { id: 'employees', label: 'Сотрудники', component: Employees },
];

function App() {
    const activeTab = useUIStore((state) => state.activeTab);
    const setActiveTab = useUIStore((state) => state.setActiveTab);

    const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || Dashboard;

    return (
        <MainLayout>
            <div className="p-6">
                <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-2 font-medium transition-all duration-200 rounded-t-lg ${
                                activeTab === tab.id
                                    ? 'border-b-2 border-primary-500 text-primary-600 bg-primary-50'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <ActiveComponent />
            </div>
        </MainLayout>
    );
}

export default App;