import {useState, useMemo, useCallback} from 'react';
import { Gantt } from '@svar-ui/react-gantt';
import { Locale } from '@svar-ui/react-core';
import { useERPStore } from '@/stores/erpStore';
import ru from '@/utils/ru';
import {formatDayMonthRu, formatMonthYearRu, getStatusColor} from "@/utils/formatters.ts";
import type {IApi} from "@svar-ui/gantt-store";
import {Save} from "lucide-react";
import StatusSpan from "@/components/ui/StatusSpan.tsx";
import {STATUS_MAPPER} from "@/utils/constants.ts";

const scales = [
    { unit: 'week', step: 1, format: formatDayMonthRu, label: "неделя" },
    { unit: 'month', step: 1, format: formatMonthYearRu, label: "месяц" },
    { unit: 'quarter', step: 1, format: '%Q-й %Y', label: "квартал" },
];

const columns = [
    { id: 'text', header: 'Название', width: 150 },
    { id: 'start', header: 'Начало', width: 100 },
    { id: 'duration', header: 'Длительность', width: 120 },
    { id: 'assigned', header: 'Статус', width: 75, cell: StatusSpan },
];

const markers = [
        {
            start: new Date(Date.now()),
            text: 'Сегодня',
        },
];

const MOCK_GROUPS = [
    {
        id: 1,
        courseId: 1,
        startDate: new Date(2026, 3, 1),
        endDate: new Date(2026, 3, 15),
        pricePerPerson: 15000,
        participantCount: 12,
        totalCost: 180000,
        averageProgress: 25,
        status: 'PLANNING',
        specificationId: null,
    },
    {
        id: 2,
        courseId: 2,
        startDate: new Date(2026, 3, 10),
        endDate: new Date(2026, 4, 5),
        pricePerPerson: 25000,
        participantCount: 8,
        totalCost: 200000,
        averageProgress: 45,
        status: 'IN_PROCESS',
        specificationId: 1,
    },
    {
        id: 3,
        courseId: 1,
        startDate: new Date(2026, 4, 15),
        endDate: new Date(2026, 4, 30),
        pricePerPerson: 15000,
        participantCount: 10,
        totalCost: 150000,
        averageProgress: 0,
        status: 'PLANNING',
        specificationId: null,
    },
    {
        id: 4,
        courseId: 3,
        startDate: new Date(2026, 2, 1),
        endDate: new Date(2026, 2, 20),
        pricePerPerson: 30000,
        participantCount: 6,
        totalCost: 180000,
        averageProgress: 100,
        status: 'COMPLETED',
        specificationId: 2,
    },
    {
        id: 5,
        courseId: 2,
        startDate: new Date(2026, 5, 1),
        endDate: new Date(2026, 5, 20),
        pricePerPerson: 25000,
        participantCount: 15,
        totalCost: 375000,
        averageProgress: 10,
        status: 'IN_PROCESS',
        specificationId: null,
    },
    {
        id: 6,
        courseId: 3,
        startDate: new Date(2026, 3, 20),
        endDate: new Date(2026, 4, 10),
        pricePerPerson: 30000,
        participantCount: 5,
        totalCost: 150000,
        averageProgress: 60,
        status: 'IN_PROCESS',
        specificationId: 1,
    },
];

const MOCK_COURSES = [
    { id: 1, name: 'JavaScript Basic', durationDays: 14, price: 15000 },
    { id: 2, name: 'React Advanced', durationDays: 21, price: 25000 },
    { id: 3, name: 'TypeScript Master', durationDays: 20, price: 30000 },
];

export function TrainingGantt() {
    const [scaleIndex, setScaleIndex] = useState(0);
    const [ganttKey, setGanttKey] = useState(0);

    const groups = MOCK_GROUPS;
    const courses = MOCK_COURSES;
    const statuses = [{id: 1, name: 'PLANNING'}, {id: 1, name: 'IN_PROCESS'}, {id: 1, name: 'COMPLETED'}];


    const [pendingChanges, setPendingChanges] = useState<Map<number, any>>(new Map());
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const updateGroup = useERPStore((state) => state.updateGroup);
    const updateCourse = useERPStore((state) => state.updateCourse);

    const ganttTasks = useMemo(() => {
        return groups.map(group => {
            const course = courses.find(c => c.id === group.courseId);

            const start = new Date(group.startDate);
            const end = new Date(group.endDate);
            const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

            return {
                id: group.id,
                text: course?.name || `Курс ${group.courseId}`,
                start: start,
                end: end,
                courseId: group.courseId,
                duration: duration,
                progress: group.averageProgress,
                color: getStatusColor(group.status),
                statusName: group.status,
                participantCount: group.participantCount,
                totalCost: group.totalCost,
            };
        });
    }, [groups, courses]);

    const handleTaskUpdate = (updatedTask: any) => {
        console.log('Task updated:', {
            courseId: updatedTask.courseId,
            dateBegin: updatedTask.start.toISOString(),
            durationInDays: updatedTask.duration,
        });

        setPendingChanges(prev => {
            const newMap = new Map(prev);
            newMap.set(updatedTask.id, {
                courseId: updatedTask.courseId,
                dateBegin: updatedTask.start.toISOString(),
                durationInDays: updatedTask.duration,
            });
            return newMap;
        });
        setHasUnsavedChanges(true);
    };

    const applyAllChanges = async () => {
        for (const [groupId, changes] of pendingChanges) {
            await Promise.all([updateGroup(groupId, {
                dateBegin: changes.dateBegin
            }), updateCourse(changes.courseId, {
                durationInDays: changes.durationInDays
            })])
        }
        setPendingChanges(new Map());
        setHasUnsavedChanges(false);
        const fetchAllData = useERPStore.getState().fetchAllData;
        await fetchAllData();
    };

    const cancelAllChanges = () => {
        setPendingChanges(new Map());
        setHasUnsavedChanges(false);
        setGanttKey(prev => prev + 1);
    };

    const handleScaleChange = () => {
        setScaleIndex((prev) => (prev + 1) % scales.length);
    };

    const init = useCallback((ganttApi: IApi) => {
        ganttApi.on('update-task', ( ev ) => {
            handleTaskUpdate(ganttApi.getTask(ev.id));
        });
    }, []);


    return (
        <div className="bg-white rounded-lg shadow-sm p-4 max-w-full">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                        План обучения
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Отображение {groups.length} учебных групп на временной шкале
                    </p>
                </div>
                <div className="flex gap-2">
                    {hasUnsavedChanges && (

                        <div className="flex gap-2">
                            <button
                                onClick={cancelAllChanges}
                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1"
                            >
                                Отменить
                            </button>
                            <button
                                onClick={applyAllChanges}
                                className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 flex items-center gap-1"
                            >
                                <Save className="w-3 h-3"/>
                                Применить изменения
                            </button>
                        </div>

                    )}
                    <div className="flex gap-2">
                        <button
                            onClick={handleScaleChange}
                            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                        >
                            Масштаб: {scales[scaleIndex].label}
                        </button>
                    </div>
                </div>
            </div>

            <div className="h-[500px] max-w-full">
                <Locale words={{...ru, ...ru}}>
                    <Gantt
                        key={ganttKey}
                        tasks={ganttTasks}
                        zoom={true}
                        init={init}
                        columns={columns}
                        scales={[scales[scaleIndex]]}
                        markers={markers}
                    />
                </Locale>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm border-t pt-4">
                {statuses.map(status => (
                    <div key={status.id} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{backgroundColor: getStatusColor(status.name)}}
                        />
                        <span>{STATUS_MAPPER[status.name] || 'Неизвестный'}</span>
                    </div>
                ))}

            </div>
        </div>
    );
}