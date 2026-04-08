import {useState, useMemo, useCallback} from 'react';
import { Gantt } from '@svar-ui/react-gantt';
import { Locale } from '@svar-ui/react-core';
import { useERPStore } from '@/stores/erpStore';
import ru from '@/utils/ru';
import {formatCurrency, formatDayMonthRu, formatMonthYearRu, getStatusColor} from "@/utils/formatters.ts";
import type {IApi} from "@svar-ui/gantt-store";
import {Save, AlertTriangle, X, Calendar, CalendarCheck, Users, Wallet, TrendingUp} from "lucide-react";
import StatusSpan from "@/components/ui/StatusSpan.tsx";
import {STATUS_MAPPER, TIME} from "@/utils/constants.ts";

const scales = [
    { unit: 'day', step: 1, format: formatDayMonthRu, label: "день" },
    { unit: 'week', step: 1, format: formatDayMonthRu, label: "неделя" },
    { unit: 'month', step: 1, format: formatMonthYearRu, label: "месяц" },
    { unit: 'quarter', step: 1, format: '%Q-й %Y', label: "квартал" },
];

const columns: any[] = [
    { id: 'text', header: 'Название', width: 150 },
    { id: 'start', header: 'Начало', width: 100 },
    { id: 'duration', header: 'Длительность', width: 120 },
    { id: 'assigned', header: 'Статус', width: 75, cell: StatusSpan },
];

export function TrainingGantt() {
    const [scaleIndex, setScaleIndex] = useState(0);
    const [ganttKey, setGanttKey] = useState(0);

    const groups = useERPStore((state) => state.groups);
    const courses = useERPStore((state) => state.courses);
    const statuses = useERPStore((state) => state.statuses);
    const idsOfGroup = useERPStore((state) => state.idsOfGroup);


    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

    const [pendingChanges, setPendingChanges] = useState<Map<number, any>>(new Map());
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const updateGroup = useERPStore((state) => state.updateGroup);
    const checkGroupEnd = useERPStore((state) => state.checkGroupEnd);

    const conflictingIds = useMemo(() => {
        const ids = new Set<number>();
        idsOfGroup.forEach(pair => { ids.add(pair.id1); ids.add(pair.id2); });
        return ids;
    }, [idsOfGroup]);

    const ganttTasks = useMemo(() => {
        return groups.map(group => {
            const course = courses.find(c => c.id === group.courseId);
            const isConflicting = conflictingIds.has(group.id);

            const start = new Date(group.startDate);
            const end = new Date(group.endDate);
            const duration = Math.ceil((end.getTime() - start.getTime()) / (TIME.DAY));

            return {
                id: group.id,
                text: isConflicting
                    ? `⚠ ${course?.name || `Курс ${group.courseId}`}`
                    : (course?.name || `Курс ${group.courseId}`),
                start: start,
                end: end,
                duration: duration,
                progress: group.averageProgress,
                color: isConflicting ? '#ef4444' : getStatusColor(group.status),
                statusName: group.status,
                participantCount: group.participantCount,
                totalCost: group.totalCost,
            };
        });
    }, [groups, courses, conflictingIds]);

    const handleTaskUpdate = (updatedTask: any) => {
        console.log('Task updated:', {
            dateBegin: updatedTask.start.toISOString(),
        });

        setPendingChanges(prev => {
            const newMap = new Map(prev);
            newMap.set(updatedTask.id, {
                dateBegin: updatedTask.start.toISOString(),
            });
            return newMap;
        });
        setHasUnsavedChanges(true);
    };

    const applyAllChanges = async () => {
        for (const [groupId, changes] of pendingChanges) {
            await updateGroup(groupId, changes);
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
        ganttApi.on('select-task', (ev) => {
            setSelectedGroupId(prev => prev === Number(ev.id) ? null : Number(ev.id));
        });
        ganttApi.on('update-task', async ( ev ) => {
            const task = ganttApi.getTask(ev.id);
            if (!task || !task?.id || !task?.start) return;
            handleTaskUpdate(task);
            const newEndDate = await checkGroupEnd(Number(task.id), task.start.toISOString());
            if (newEndDate) {
                ganttApi?.exec("update-task", { id: task.id, task: { end: new Date(newEndDate), duration: Math.ceil(
                            (new Date(newEndDate).getTime() - new Date(task.start).getTime()) /
                            (TIME.DAY)
                        ) }});
            }
        });
    }, [checkGroupEnd]);


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
                {idsOfGroup.length > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span>Пересечение групп</span>
                    </div>
                )}
            </div>

            {selectedGroupId !== null && (() => {
                const group = groups.find(g => g.id === selectedGroupId);
                if (!group) return null;
                const course = courses.find(c => c.id === group.courseId);
                const progressPct = Math.round(group.averageProgress * 100);
                const progressColor = progressPct >= 80 ? 'bg-green-500' : progressPct >= 40 ? 'bg-yellow-500' : 'bg-primary-500';
                const conflictPartners = idsOfGroup
                    .filter(p => p.id1 === selectedGroupId || p.id2 === selectedGroupId)
                    .map(p => {
                        const partnerId = p.id1 === selectedGroupId ? p.id2 : p.id1;
                        const partner = groups.find(g => g.id === partnerId);
                        return { id: partnerId, name: courses.find(c => c.id === partner?.courseId)?.name || `Группа #${partnerId}` };
                    });
                const formatDate = (d: Date | string) => d ? new Date(d).toLocaleDateString('ru-RU') : '—';
                return (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedGroupId(null)}>
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{course?.name ?? `Группа #${group.id}`}</h3>
                                        <p className="text-sm text-gray-500">Группа #{group.id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedGroupId(null)}
                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                <div className="bg-primary-50 rounded-lg p-3 flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500"><Calendar className="w-4 h-4 text-primary-500" /><span>Дата начала</span></div>
                                    <div className="text-base font-semibold text-gray-800">{formatDate(group.startDate)}</div>
                                </div>
                                <div className="bg-primary-50 rounded-lg p-3 flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500"><CalendarCheck className="w-4 h-4 text-primary-500" /><span>Дата окончания</span></div>
                                    <div className="text-base font-semibold text-gray-800">{formatDate(group.endDate)}</div>
                                </div>
                                <div className="bg-primary-50 rounded-lg p-3 flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500"><Users className="w-4 h-4 text-primary-500" /><span>Участников</span></div>
                                    <div className="text-base font-semibold text-gray-800">{group.participantCount}</div>
                                </div>
                                <div className="bg-primary-50 rounded-lg p-3 flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500"><Wallet className="w-4 h-4 text-primary-500" /><span>Стоимость</span></div>
                                    <div className="text-base font-semibold text-gray-800">{formatCurrency(group.totalCost)}</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500"><TrendingUp className="w-4 h-4 text-primary-500" /><span>Прогресс</span></div>
                                    <span className="text-sm font-semibold text-gray-800">{progressPct}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all ${progressColor}`} style={{ width: `${Math.min(100, progressPct)}%` }} />
                                </div>
                            </div>

                            {conflictPartners.length > 0 && (
                                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <span className="font-medium text-red-700">Пересечение с группами: </span>
                                        <span className="text-red-600">
                                            {conflictPartners.map((p, i) => (
                                                <span key={p.id}>{i > 0 && ', '}<span className="font-medium">#{p.id}</span> {p.name}</span>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })()}

            {idsOfGroup.length > 0 && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="text-sm font-medium text-red-700">
                            Обнаружены пересечения групп ({idsOfGroup.length})
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {idsOfGroup.map((pair, i) => {
                            const g1 = groups.find(g => g.id === pair.id1);
                            const g2 = groups.find(g => g.id === pair.id2);
                            const name1 = courses.find(c => c.id === g1?.courseId)?.name || `Группа #${pair.id1}`;
                            const name2 = courses.find(c => c.id === g2?.courseId)?.name || `Группа #${pair.id2}`;
                            return (
                                <span key={i} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-red-100 text-red-700 border border-red-200">
                                    <span className="font-medium">#{pair.id1}</span> {name1}
                                    <span className="text-red-400 mx-0.5">×</span>
                                    <span className="font-medium">#{pair.id2}</span> {name2}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}