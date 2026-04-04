import { useState } from 'react';
import { Grid, Toolbar, ContextMenu, HeaderMenu } from '@svar-ui/react-grid';
import { Plus } from 'lucide-react';
import { Locale } from '@svar-ui/react-core';
import { TrainingGroupForm } from './TrainingGroupForm';
import { formatCurrency } from '@/utils/formatters';
import ru from '@/utils/ru';
import {useCourses} from "@/hooks/useCourses.ts";
import {useGroups} from "@/hooks/useGroups.ts";

export function TrainingGroups() {
    const [showForm, setShowForm] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [api, setApi] = useState(null);

    const { groups, isLoading } = useGroups();
    const courses = useCourses();

    const columns = [
        { id: 'id', header: 'ID', width: 80 },
        { id: 'courseId', header: 'Курс', width: 180,
            template: (value: number) => courses.find(c => c.id === value)?.name || '—'},
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
            action: async () => {},
        },
    ];

    if (isLoading && groups.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Загрузка групп...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Учебные группы</h2>
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