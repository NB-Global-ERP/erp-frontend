import { useState, useMemo } from 'react';
import { Gantt } from '@svar-ui/react-gantt';
import { Locale } from '@svar-ui/react-core';
import { useERPStore } from '@/stores/erpStore';
import { useCourses } from '@/hooks/useCourses';
import ru from '@/utils/ru';

const scales = [
    { unit: 'week', step: 1, format: '%d %M' },
    { unit: 'month', step: 1, format: '%M %Y' },
    { unit: 'quarter', step: 1, format: '%Q-й %Y' },
];

export function TrainingGantt() {
    const [scaleIndex, setScaleIndex] = useState(0);
    const groups = useERPStore((state) => state.getGroupsWithCalculations());
    const updateGroup = useERPStore((state) => state.updateGroup);
    const courses = useCourses();

    const ganttTasks = useMemo(() => {
        return groups.map(group => {
            const course = courses.find(c => c.id === group.courseId);
            return {
                id: group.id,
                text: course?.name || 'Неизвестный курс',
                start: new Date(group.startDate),
                end: new Date(group.endDate),
                progress: group.averageProgress,
                color: getStatusColor(group.status),
            };
        });
    }, [groups, courses]);

    const handleTaskUpdate = (updatedTask: any) => {
        updateGroup(updatedTask.id, {
            startDate: updatedTask.start,
            endDate: updatedTask.end,
        });
    };

    const handleScaleChange = () => {
        setScaleIndex((prev) => (prev + 1) % scales.length);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Диаграмма Ганта - План обучения
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
                        Масштаб: {scales[scaleIndex].unit}
                    </button>
                </div>
            </div>

            <div style={{ height: '500px' }}>
                <Locale words={{ ...ru, ...ru }}>
                    <Gantt
                        tasks={ganttTasks}
                        scales={[scales[scaleIndex]]}
                        onTaskUpdate={handleTaskUpdate}
                        onTaskClick={(task) => {
                            console.log('Группа выбрана:', task);
                        }}
                    />
                </Locale>
            </div>

            <div className="mt-4 flex gap-4 text-sm border-t pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <span>Планируется</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-500"></div>
                    <span>В процессе</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500"></div>
                    <span>Завершено</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500"></div>
                    <span>Отменено</span>
                </div>
            </div>
        </div>
    );
}

function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        planned: '#3b82f6',
        in_progress: '#f59e0b',
        completed: '#22c55e',
        cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
}