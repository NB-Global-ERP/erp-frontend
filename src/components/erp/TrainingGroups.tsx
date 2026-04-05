import {useCallback, useState} from 'react';
import {Grid, HeaderMenu, type IApi, type IFilterValues} from '@svar-ui/react-grid';
import {Pen, Plus} from 'lucide-react';
import { Locale } from '@svar-ui/react-core';
import { TrainingGroupForm } from './TrainingGroupForm';
import { formatCurrency } from '@/utils/formatters';
import ru from '@/utils/ru';
import {useGroups} from "@/hooks/useGroups.ts";
import type {TrainingGroup} from "@/types/erp.types.ts";
import {useERPStore} from "@/stores/erpStore.ts";

export function TrainingGroups() {
    const [showForm, setShowForm] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<TrainingGroup | null>(null);
    const [api, setApi] = useState<IApi>();
    const [filterValues, setFilterValues] = useState<IFilterValues>({});

    const { groups } = useGroups();

    const columns = [
        { id: 'courseName', header: 'Курс', width: 180},
        { id: 'startDate', header: 'Дата начала', width: 120,
            template: (value: Date | string) => value ? new Date(value).toLocaleDateString('ru-RU') : '—'},
        { id: 'endDate', header: 'Дата окончания', width: 120,
            template: (value: Date | string) => value ? new Date(value).toLocaleDateString('ru-RU') : '—'},
        { id: 'participantCount', header: 'Участников', width: 100 },
        { id: 'averageProgress', header: 'Прогресс', width: 100,
            template: (value: number) => `${value}%`, editor: 'number' },
        { id: 'totalCost', header: 'Стоимость', width: 150,
            template: (value: number) => formatCurrency(value) },
        { id: 'status', header: 'Статус', width: 120},
    ];

    const init = useCallback((gridApi: IApi) => {
        setApi(gridApi);
        gridApi.on('select-row', ({ id }: { id: string | number  }) => {
            const row = gridApi.getRow(id) as TrainingGroup;
            if (row) {
                setSelectedGroup(row);
            }
        });
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Учебные группы</h2>
                <div className="flex gap-4">
                    {!!selectedGroup && (
                        <button
                            onClick={() => {
                                setShowForm(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors"
                        >
                            <Pen className="w-4 h-4"/>
                            Редактировать группу
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setSelectedGroup(null);
                            setShowForm(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        <Plus className="w-4 h-4"/>
                        Добавить группу
                    </button>
                </div>
            </div>
            <Locale words={{...ru, ...ru}}>
                <HeaderMenu api={api}>
                    <Grid
                        init={init}
                        data={groups}
                        columns={columns}
                        filterValues={filterValues}
                        onFilterChange={setFilterValues}
                    />
                </HeaderMenu>
            </Locale>

            {showForm && (
                <TrainingGroupForm
                    group={selectedGroup}
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