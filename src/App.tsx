import { MainLayout } from '@/components/layout/MainLayout';
import {useUIStore} from "@/stores/uiStore.ts";
import {FinancialTable} from "@/components/field/FinancialTable.tsx";

function App() {
  const activeTab = useUIStore((state: { activeTab: any; }) => state.activeTab);
  const setActiveTab = useUIStore((state: { setActiveTab: any; }) => state.setActiveTab);

  return (
      <MainLayout>
        <div className="p-6">
          <div className="flex gap-2 border-b border-gray-200 mb-6">
            <button
                onClick={() => setActiveTab('budget')}
                className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === 'budget'
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-gray hover:text-gray-700'
                }`}
            >
              Бюджет
            </button>
            <button
                onClick={() => setActiveTab('gantt')}
                className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === 'gantt'
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-gray hover:text-gray-700'
                }`}
            >
              Планирование
            </button>
            <button
                onClick={() => setActiveTab('form')}
                className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === 'form'
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-gray hover:text-gray-700'
                }`}
            >
              Создать заявку
            </button>
          </div>

          {activeTab === 'budget' && <FinancialTable />}

        </div>
      </MainLayout>
  );
}

export default App;