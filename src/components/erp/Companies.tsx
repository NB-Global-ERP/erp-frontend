import {useCallback, useState} from 'react';
import {Grid, HeaderMenu, type IApi, type IFilterValues } from '@svar-ui/react-grid';
import { useERPStore } from '@/stores/erpStore';
import { CompanyForm } from './CompanyForm';
import {Pen, Plus, RefreshCw} from 'lucide-react';
import ru from "@/utils/ru.ts";
import { Locale } from "@svar-ui/react-core";
import {useCompanies} from "@/hooks/useCompanies.ts";
import type {Company} from "@/types/erp.types.ts";

export function Companies() {
    const [showForm, setShowForm] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [api, setApi] = useState<IApi>();
    const [filterValues, setFilterValues] = useState<IFilterValues>({});
    const [gridKey, setGridKey] = useState(0);

    const {companies, isLoading} = useCompanies();
    const fetchAllData = useERPStore((state) => state.fetchAllData);

    const handleRefresh = async () => {
        await fetchAllData();
        setGridKey(k => k + 1);
    };

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

    const init = useCallback((gridApi: IApi) => {
        setApi(gridApi);
        gridApi.on('select-row', ({ id }: { id: string | number  }) => {
            const row = gridApi.getRow(id) as Company;
            if (row) {
                setSelectedCompany(row);
            }
        });
    }, []);


    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Справочник компаний</h2>
                <div className="flex gap-4">
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}/>
                        Обновить
                    </button>
                    {!!selectedCompany && (
                        <button
                            onClick={() => {
                                setShowForm(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors"
                        >
                            <Pen className="w-4 h-4"/>
                            Редактировать компанию
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setSelectedCompany(null);
                            setShowForm(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        <Plus className="w-4 h-4"/>
                        Добавить компанию
                    </button>
                </div>
            </div>

            <Locale words={{...ru, ...ru}}>
                <HeaderMenu api={api}>
                    <Grid
                        key={gridKey}
                        init={init}
                        data={companies}
                        columns={columns}
                        filterValues={filterValues}
                        onFilterChange={setFilterValues}
                    />
                </HeaderMenu>
            </Locale>

            {showForm && (
                <CompanyForm
                    company={selectedCompany}
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