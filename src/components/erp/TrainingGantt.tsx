import { useState, useMemo } from 'react';
import { Gantt, ContextMenu } from '@svar-ui/react-gantt';
import { Locale } from '@svar-ui/react-core';
import { useERPStore } from '@/stores/erpStore';
import ru from '@/utils/ru';
import {formatDayMonthRu, formatMonthYearRu, getStatusColor} from "@/utils/formatters.ts";
import type {IApi} from "@svar-ui/gantt-store";

const scales = [
    { unit: 'week', step: 1, format: formatDayMonthRu, label: "неделя" },
    { unit: 'month', step: 1, format: formatMonthYearRu, label: "месяц" },
    { unit: 'quarter', step: 1, format: '%Q-й %Y', label: "квартал" },
];

const columns = [
    { id: 'text', header: 'Название', width: 150 },
    { id: 'start', header: 'Начало', width: 100 },
    { id: 'duration', header: 'Длительность', width: 150 },
];

export function TrainingGantt() {
    const [scaleIndex, setScaleIndex] = useState(0);
    const [api, setApi] = useState<IApi>();

    const groups = useERPStore((state) => state.groups);
    const courses = useERPStore((state) => state.courses);
    const statuses = [{id: 1, name: 'PLANNING'}, {id: 1, name: 'IN_PROCESS'}, {id: 1, name: 'COMPLETED'}]
    const updateGroup = useERPStore((state) => state.updateGroup);

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
                duration: duration,
                progress: group.averageProgress / 100,
                color: getStatusColor(group.status),
                statusName: group.status,
                participantCount: group.participantCount,
                totalCost: group.totalCost,
            };
        });
    }, [groups, courses]);

    const handleTaskUpdate = async (updatedTask: any) => {
        await updateGroup(updatedTask.id, {
            dateBegin: updatedTask.start.toISOString(),
            dateEnd: updatedTask.end.toISOString(),
        });
        const fetchAllData = useERPStore.getState().fetchAllData;
        await fetchAllData();
    };

    const handleScaleChange = () => {
        setScaleIndex((prev) => (prev + 1) % scales.length);
    };

    const handleTaskClick = (task: any) => {
        console.log('Группа выбрана:', {
            id: task.id,
            name: task.text,
            start: task.start,
            end: task.end,
            progress: task.progress * 100,
            status: task.statusName,
            participants: task.participantCount,
            cost: task.totalCost,
        });
    };

    if (ganttTasks.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
                Нет учебных групп для отображения на диаграмме Ганта
            </div>
        );
    }

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
                    <button
                        onClick={handleScaleChange}
                        className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    >
                        Масштаб: {scales[scaleIndex].label}
                    </button>
                </div>
            </div>

            <div className="h-[500px] max-w-full">
                <Locale words={{...ru, ...ru}}>
                    <ContextMenu api={api}>
                        <Gantt
                            tasks={ganttTasks}
                            zoom={true}
                            init={setApi}
                            columns={columns}
                            scales={[scales[scaleIndex]]}
                            onTaskUpdate={handleTaskUpdate}
                            onTaskClick={handleTaskClick}
                        />
                    </ContextMenu>
                </Locale>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm border-t pt-4">
                {statuses.map(status => (
                    <div key={status.id} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{backgroundColor: getStatusColor(status.name)}}
                        />
                        <span>{status.name}</span>
                    </div>
                ))}
                <div className="flex items-center gap-2 ml-auto">
                    <div className="w-3 h-3 rounded bg-gray-200"></div>
                    <span>Прогресс</span>
                </div>
            </div>
        </div>
    );
}