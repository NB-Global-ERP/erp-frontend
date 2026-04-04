import {useMemo, useState} from 'react';
import {Grid, Toolbar, ContextMenu, HeaderMenu} from '@svar-ui/react-grid';
import { useERPStore } from '@/stores/erpStore';
import { TrainingGroupForm } from './TrainingGroupForm';
import { Plus } from 'lucide-react';
import {formatCurrency} from "@/utils/formatters.ts";
import ru from "@/utils/ru.ts";
import { Locale } from '@svar-ui/react-core';
import {STATUS_MAPPER, STATUS_OPTIONS_FOR_GRID} from "@/utils/constants.ts";
import {useCourses} from "@/hooks/useCourses.ts";

export function TrainingGroups() {
    const [showForm, setShowForm] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [api, setApi] = useState(null);

    const groups = useERPStore((state) => state.groups);
    const participants = useERPStore((state) => state.participants);
    const courses = useCourses();

    const groupsWithCalculations = useMemo(() => {
        if (!groups || !participants) return [];

        return groups.map(group => ({
            ...group,
            participantCount: participants.filter(p => p.groupId === group.id).length,
            totalCost: participants.filter(p => p.groupId === group.id).length * group.pricePerPerson,
            averageProgress: 0, // Рассчитайте по необходимости
        }));
    }, [groups, participants]);

    const courseOptions = useMemo(() => {
        if (!courses || !Array.isArray(courses)) return [];
        return courses.map(course => ({
            id: course.id,
            label: course.name
        }));
    }, [courses]);

    const columns = [
        { id: 'name', header: 'Название группы', width: 200, editor: 'text' },
        { id: 'courseId', header: 'Курс', width: 160,
            template: (value: string) => {
                if (!value) return '—';
                const course = courses?.find(c => c.id === value);
                return course?.name || value;
            }, editor: { type: 'richselect'}, options: courseOptions },
        { id: 'startDate', header: 'Дата начала', width: 120, editor: 'datepicker',
            template: (value: Date | string) => {
                if (!value) return '—';
                if (value instanceof Date) {
                    return isNaN(value.getTime()) ? '—' : value.toLocaleDateString('ru-RU');
                }
                const date = new Date(value);
                return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('ru-RU');
            }},
        { id: 'endDate', header: 'Дата окончания', width: 120, editor: 'datepicker',
            template: (value: Date | string) => {
                if (!value) return '—';
                if (value instanceof Date) {
                    return isNaN(value.getTime()) ? '—' : value.toLocaleDateString('ru-RU');
                }
                const date = new Date(value);
                return isNaN(date.getTime()) ? '—' : date.toLocaleDateString('ru-RU');
            }},
        { id: 'participantCount', header: 'Участников', width: 100 },
        { id: 'averageProgress', header: 'Прогресс', width: 100,
            template: (value: number) => `${value}%`,
            editor: 'number' },
        { id: 'totalCost', header: 'Стоимость', width: 150,
            template: (value: number) => formatCurrency(value) },
        { id: 'status', header: 'Статус', width: 120,
            template: (value: string) => STATUS_MAPPER[value as keyof typeof STATUS_MAPPER] || value,
            editor: { type: 'richselect'}, options: STATUS_OPTIONS_FOR_GRID},
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
                            data={groupsWithCalculations}
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