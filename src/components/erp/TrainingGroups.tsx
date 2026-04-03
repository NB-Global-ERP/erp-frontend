import { useState } from 'react';
import {Grid, Toolbar, ContextMenu, HeaderMenu} from '@svar-ui/react-grid';
import { useERPStore } from '@/stores/erpStore';
import { TrainingGroupForm } from './TrainingGroupForm';
import { Plus } from 'lucide-react';
import {formatCurrency} from "@/utils/formatters.ts";
import ru from "@/utils/ru.ts";
import { Locale } from '@svar-ui/react-core';
import {STATUS} from "@/utils/constants.ts";

export function TrainingGroups() {
    const [showForm, setShowForm] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [api, setApi] = useState(null);

    const groups = useERPStore((state) => state.getGroupsWithCalculations());

    const columns = [
        { id: 'courseName', header: 'Курс', width: 200,
            format: (value: any, row: any) => row.courseId },
        { id: 'startDate', header: 'Дата начала', width: 120, editor: 'datepicker',
            format: (value: Date) => value?.toLocaleDateString('ru-RU') },
        { id: 'endDate', header: 'Дата окончания', width: 120, editor: 'datepicker',
            format: (value: Date) => value?.toLocaleDateString('ru-RU') },
        { id: 'participantCount', header: 'Участников', width: 100 },
        { id: 'averageProgress', header: 'Прогресс, %', width: 100,
            format: (value: number) => `${value}%` },
        { id: 'totalCost', header: 'Стоимость, ₽', width: 150,
            format: (value: number) => formatCurrency(value) },
        { id: 'status', header: 'Статус', width: 120, editor: { type: 'combo', }, options: STATUS },
    ];

    const toolbarItems = [
        {
            id: 'add-group',
            comp: 'button',
            icon: 'wxi-plus',
            text: 'Создать группу',
            action: () => {
                setSelectedGroupId(null);
                setShowForm(true);
            },
        },
        { comp: 'spacer' },
        {
            id: 'refresh',
            comp: 'button',
            icon: 'wxi-refresh',
            text: 'Обновить',
            action: () => {},
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Учебные группы</h2>
                <button
                    onClick={() => {
                        setSelectedGroupId(null);
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Создать группу
                </button>
            </div>
            <Locale words={{ ...ru, ...ru }}>
                <ContextMenu api={api}>
                    <HeaderMenu api={api}>
                        <Grid
                            init={setApi}
                            data={groups}
                            columns={columns}
                            toolbar={<Toolbar items={toolbarItems} />}
                            onRowDoubleClick={(row) => {
                                setSelectedGroupId(row.id);
                                setShowForm(true);
                            }}
                        />
                    </HeaderMenu>
                </ContextMenu>
            </Locale>

            {showForm && (
                <TrainingGroupForm
                    groupId={selectedGroupId}
                    onClose={() => setShowForm(false)}
                    onSave={() => setShowForm(false)}
                />
            )}
        </div>
    );
}