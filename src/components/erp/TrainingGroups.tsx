import {useCallback, useEffect, useRef, useState} from 'react';
import {Grid, HeaderMenu, type IApi, type IFilterValues} from '@svar-ui/react-grid';
import {AlertTriangle, Calendar, CalendarCheck, ChevronDown, Pen, Plus, RefreshCw, TrendingUp, Users, Wallet, X} from 'lucide-react';
import { Locale } from '@svar-ui/react-core';
import { TrainingGroupForm } from './TrainingGroupForm';
import { GroupParticipants } from './GroupParticipants';
import { formatCurrency } from '@/utils/formatters';
import ru from '@/utils/ru';
import {useGroups} from "@/hooks/useGroups.ts";
import type {TrainingGroup} from "@/types/erp.types.ts";
import {useERPStore} from "@/stores/erpStore.ts";

type GroupWithCourse = TrainingGroup & { courseName?: string };

export function TrainingGroups() {
    const [showForm, setShowForm] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<GroupWithCourse | null>(null);
    const [api, setApi] = useState<IApi>();
    const [filterValues, setFilterValues] = useState<IFilterValues>({});
    const [gridKey, setGridKey] = useState(0);

    const selectedGroupRef = useRef<GroupWithCourse | null>(null);
    const showDetailRef = useRef(false);
    selectedGroupRef.current = selectedGroup;
    showDetailRef.current = showDetail;

    const { groups, isLoading } = useGroups();
    const idsOfGroup = useERPStore((state) => state.idsOfGroup);

    useEffect(() => {
        if (!selectedGroup) return;
        const updated = groups.find(g => g.id === selectedGroup.id);
        if (updated) setSelectedGroup(updated);
    }, [groups]);
    const fetchAllData = useERPStore((state) => state.fetchAllData);

    const handleRefresh = async () => {
        await fetchAllData();
        setGridKey(k => k + 1);
    };

    const columns = [
        { id: 'courseName', header: 'Курс', width: 180},
        { id: 'startDate', header: 'Дата начала', width: 120,
            template: (value: Date | string) => value ? new Date(value).toLocaleDateString('ru-RU') : '—'},
        { id: 'endDate', header: 'Дата окончания', width: 120,
            template: (value: Date | string) => value ? new Date(value).toLocaleDateString('ru-RU') : '—'},
        { id: 'participantCount', header: 'Участников', width: 100 },
        { id: 'averageProgress', header: 'Прогресс', width: 100,
            template: (value: number) => `${Math.round(value * 100)}%` },
        { id: 'totalCost', header: 'Стоимость', width: 150,
            template: (value: number) => formatCurrency(value) },
        { id: 'status', header: 'Статус', width: 120},
    ];

    const init = useCallback((gridApi: IApi) => {
        setApi(gridApi);
        gridApi.on('select-row', ({ id }: { id: string | number }) => {
            const row = gridApi.getRow(id) as GroupWithCourse;
            if (!row) return;
            if (selectedGroupRef.current?.id === row.id) {
                setShowDetail(!showDetailRef.current);
            } else {
                setSelectedGroup(row);
                setShowDetail(true);
            }
        });
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Учебные группы</h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}/>
                        Обновить
                    </button>
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
                        key={gridKey}
                        init={init}
                        data={groups}
                        columns={columns}
                        filterValues={filterValues}
                        onFilterChange={setFilterValues}
                    />
                </HeaderMenu>
            </Locale>

            {selectedGroup && showDetail && (
                <GroupDetailPanel
                    group={selectedGroup}
                    conflictingWith={idsOfGroup
                        .filter(p => p.id1 === selectedGroup.id || p.id2 === selectedGroup.id)
                        .map(p => {
                            const partnerId = p.id1 === selectedGroup.id ? p.id2 : p.id1;
                            const partner = groups.find(g => g.id === partnerId);
                            return { id: partnerId, courseName: (partner as GroupWithCourse)?.courseName || `Группа #${partnerId}` };
                        })
                    }
                    onEdit={() => setShowForm(true)}
                    onShowParticipants={() => setShowParticipants(true)}
                    onClose={() => setShowDetail(false)}
                />
            )}

            {showForm && (
                <TrainingGroupForm
                    group={selectedGroup}
                    onClose={() => setShowForm(false)}
                    onSave={() => {
                        setShowForm(false);
                        useERPStore.getState().fetchAllData();
                    }}
                />
            )}

            {showParticipants && selectedGroup && (
                <GroupParticipants
                    group={selectedGroup}
                    onClose={() => setShowParticipants(false)}
                />
            )}
        </div>
    );
}

interface GroupDetailPanelProps {
    group: GroupWithCourse;
    conflictingWith?: { id: number; courseName: string }[];
    onEdit: () => void;
    onShowParticipants: () => void;
    onClose: () => void;
}

function GroupDetailPanel({ group, conflictingWith = [], onEdit, onShowParticipants, onClose }: GroupDetailPanelProps) {
    const formatDate = (d: Date | string) =>
        d ? new Date(d).toLocaleDateString('ru-RU') : '—';

    const progressPct = Math.round(group.averageProgress * 100);
    const progressColor =
        progressPct >= 80 ? 'bg-green-500' :
        progressPct >= 40 ? 'bg-yellow-500' :
        'bg-primary-500';

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <ChevronDown className="w-4 h-4 text-primary-500" />
                    <span>Детали группы</span>
                    <span className="text-gray-400 font-normal">— {group.courseName ?? `#${group.id}`}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium"
                    >
                        <Pen className="w-4 h-4" />
                        Редактировать
                    </button>
                    <button
                        onClick={onShowParticipants}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                    >
                        <Users className="w-4 h-4" />
                        Участники группы
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Скрыть"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                <DetailCard
                    icon={<Calendar className="w-4 h-4 text-primary-500" />}
                    label="Дата начала"
                    value={formatDate(group.startDate)}
                    bg="bg-primary-50"
                />
                <DetailCard
                    icon={<CalendarCheck className="w-4 h-4 text-primary-500" />}
                    label="Дата окончания"
                    value={formatDate(group.endDate)}
                    bg="bg-primary-50"
                />
                <DetailCard
                    icon={<Users className="w-4 h-4 text-primary-500" />}
                    label="Участников"
                    value={String(group.participantCount)}
                    bg="bg-primary-50"
                />
                <DetailCard
                    icon={<Wallet className="w-4 h-4 text-primary-500" />}
                    label="Стоимость"
                    value={formatCurrency(group.totalCost)}
                    bg="bg-primary-50"
                />
                <div className="bg-gray-50 rounded-lg p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <TrendingUp className="w-4 h-4 text-primary-500" />
                        <span>Прогресс</span>
                    </div>
                    <div className="text-base font-semibold text-gray-800">{progressPct}%</div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${progressColor}`}
                            style={{ width: `${Math.min(100, progressPct)}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-3 flex items-center gap-3 flex-wrap">
                {group.status && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Статус:</span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                            {group.status}
                        </span>
                    </div>
                )}
                {conflictingWith.length > 0 && (
                    <div className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <span className="font-medium text-red-700">Пересечение с группами: </span>
                            <span className="text-red-600">
                                {conflictingWith.map((p, i) => (
                                    <span key={p.id}>{i > 0 && ', '}<span className="font-medium">#{p.id}</span> {p.courseName}</span>
                                ))}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function DetailCard({ icon, label, value, bg }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    bg: string;
}) {
    return (
        <div className={`${bg} rounded-lg p-3 flex flex-col gap-1`}>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                {icon}
                <span>{label}</span>
            </div>
            <div className="text-base font-semibold text-gray-800 truncate">{value}</div>
        </div>
    );
}
