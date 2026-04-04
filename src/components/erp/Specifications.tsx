import { useState } from 'react';
import {ContextMenu, Grid, HeaderMenu, type IApi, type IFilterValues} from '@svar-ui/react-grid';
import { useERPStore } from '@/stores/erpStore';
import { SpecificationForm } from './SpecificationForm';
import { formatCurrency } from '@/utils/formatters.ts';
import { Plus } from 'lucide-react';
import ru from "@/utils/ru.ts";
import { Locale } from "@svar-ui/react-core";
import {useSpecifications} from "@/hooks/useSpecifications.ts";

export function Specifications() {
    const [showForm, setShowForm] = useState(false);
    const [selectedSpecId, setSelectedSpecId] = useState<number | null>(null);
    const [api, setApi] = useState<IApi>();
    const [filterValues, setFilterValues] = useState<IFilterValues>({});

    const { specifications, isLoading } = useSpecifications();

    const columns = [
        {
            id: 'number',
            header: 'Номер',
            width: 100,
            template: (value: number) => value?.toString() || '—'
        },
        {
            id: 'date',
            header: 'Дата',
            width: 120,
            template: (value: Date | string) => value ? new Date(value).toLocaleDateString('ru-RU') : '—'
        },
        {
            id: 'companyName',
            header: 'Компания',
            width: 200,
            template: (value: string) => value || '—'
        },
        {
            id: 'groupsCount',
            header: 'Групп',
            width: 80,
            template: (value: number) => value?.toString() || '0'
        },
        {
            id: 'participantsCount',
            header: 'Участников',
            width: 100,
            template: (value: number) => value?.toString() || '0'
        },
        {
            id: 'totalAmount',
            header: 'Сумма без НДС',
            width: 150,
            template: (value: number) => formatCurrency(value || 0)
        },
        {
            id: 'totalWithVat',
            header: 'Итого с НДС',
            width: 150,
            template: (value: number) => formatCurrency(value || 0)
        },
    ];

    const handleRowDoubleClick = (row: any) => {
        setSelectedSpecId(row.id);
        setShowForm(true);
    };

    if (isLoading && specifications.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Загрузка спецификаций...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Спецификации</h2>
                <button
                    onClick={() => {
                        setSelectedSpecId(null);
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Создать спецификацию
                </button>
            </div>

            <Locale words={{ ...ru, ...ru }}>
                <ContextMenu api={api}>
                    <HeaderMenu api={api}>
                        <Grid
                            init={setApi}
                            data={specifications}
                            columns={columns}
                            filterValues={filterValues}
                            onFilterChange={setFilterValues}
                            onRowDoubleClick={handleRowDoubleClick}
                        />
                    </HeaderMenu>
                </ContextMenu>
            </Locale>

            {showForm && (
                <SpecificationForm
                    specId={selectedSpecId}
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