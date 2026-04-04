import { useState, useMemo } from 'react';
import { ContextMenu, Grid, HeaderMenu, Toolbar } from '@svar-ui/react-grid';
import { useERPStore } from '@/stores/erpStore';
import { CompanyForm } from './CompanyForm';
import { Plus } from 'lucide-react';
import ru from "@/utils/ru.ts";
import { Locale } from "@svar-ui/react-core";

export function Companies() {
    const [showForm, setShowForm] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
    const [api, setApi] = useState(null);

    const companies = useERPStore((state) => state.companies);
    const employees = useERPStore((state) => state.employees);
    const specifications = useERPStore((state) => state.specifications);

    const companiesWithStats = useMemo(() => {
        return companies.map(company => ({
            id: company.id,
            code: company.code,
            name: company.name,
            employeesCount: employees.filter(e => e.companyId === company.id).length,
            specificationsCount: specifications.filter(s => s.companyId === company.id).length,
        }));
    }, [companies, employees, specifications]);

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
            template: (value: number) => value || 0
        },
        {
            id: 'specificationsCount',
            header: 'Спецификаций',
            width: 130,
            template: (value: number) => value || 0
        },
    ];

    const toolbarItems = [
        {
            id: 'add-company',
            comp: 'button',
            icon: 'wxi-plus',
            text: 'Создать компанию',
            action: () => {
                setSelectedCompanyId(null);
                setShowForm(true);
            },
        },
        { comp: 'spacer' },
        {
            id: 'refresh',
            comp: 'button',
            icon: 'wxi-refresh',
            text: 'Обновить',
            action: async () => {
                const fetchAllData = useERPStore.getState().fetchAllData;
                await fetchAllData();
            },
        },
    ];

    const handleRowDoubleClick = (row: any) => {
        setSelectedCompanyId(row.id);
        setShowForm(true);
    };

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
                            data={companiesWithStats}
                            columns={columns}
                            toolbar={<Toolbar items={toolbarItems} />}
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