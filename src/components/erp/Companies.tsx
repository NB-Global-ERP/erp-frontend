import {useState} from 'react';
import {ContextMenu, Grid, HeaderMenu, type IApi, type IFilterValues } from '@svar-ui/react-grid';
import { useERPStore } from '@/stores/erpStore';
import { CompanyForm } from './CompanyForm';
import { Plus } from 'lucide-react';
import ru from "@/utils/ru.ts";
import { Locale } from "@svar-ui/react-core";
import {useCompanies} from "@/hooks/useCompanies.ts";

export function Companies() {
    const [showForm, setShowForm] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
    const [api, setApi] = useState<IApi>();
    const [filterValues, setFilterValues] = useState<IFilterValues>({});

    const {companies, isLoading} = useCompanies();

    const columns = [
        {
            id: 'code',
            header: 'Код',
            width: 100,
            template: (value: string) => value || '—'
        },
        {
            id: 'name',
            header: 'Компания',
            width: 250,
            template: (value: string) => value || '—'
        },
        {
            id: 'employeesCount',
            header: 'Сотрудников',
            width: 120,
            template: (value: number) => value?.toString() || '0'
        },
        {
            id: 'specificationsCount',
            header: 'Спецификаций',
            width: 130,
            template: (value: number) => value?.toString() || '0'
        },
    ];

    const handleRowDoubleClick = (row: any) => {
        setSelectedCompanyId(row.id);
        setShowForm(true);
    };

    if (isLoading && companies.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Загрузка компаний...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Справочник компаний</h2>
                <button
                    onClick={() => {
                        setSelectedCompanyId(null);
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Добавить компанию
                </button>
            </div>

            <Locale words={{ ...ru, ...ru }}>
                <ContextMenu api={api}>
                    <HeaderMenu api={api}>
                        <Grid
                            init={setApi}
                            data={companies}
                            columns={columns}
                            filterValues={filterValues}
                            onFilterChange={setFilterValues}
                            onRowDoubleClick={handleRowDoubleClick}
                        />
                    </HeaderMenu>
                </ContextMenu>
            </Locale>

            {showForm && (
                <CompanyForm
                    companyId={selectedCompanyId}
                    onClose={() => setShowForm(false)}
                    onSave={() => {
                        setShowForm(false);
                        const fetchAllData = useERPStore.getState().fetchAllData;
                        fetchAllData();
                    }}
                />
            )}
        </div>
    );
}