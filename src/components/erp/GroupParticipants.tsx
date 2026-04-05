import { useEffect, useState } from 'react';
import {
    X, Loader2, AlertCircle, Users, RefreshCw, Save,
    ChevronUp, ChevronDown, UserPlus, Search, Award, Eye, CheckCircle
} from 'lucide-react';
import { getGroupMembers, patchGroupMembers, addStudentsToGroup, createCertificate, getCertificatePdf } from '@/services/api';
import { getStudentRaw } from '@/services/rawApi';
import { mapEmployee } from '@/utils/adapters';
import { useERPStore } from '@/stores/erpStore';
import type { TrainingGroup, GroupMember, Employee } from '@/types/erp.types';

interface EnrichedMember extends GroupMember {
    employee: Employee | null;
}

interface GroupParticipantsProps {
    group: TrainingGroup & { courseName?: string };
    onClose: () => void;
}

type Tab = 'members' | 'certificates';

export function GroupParticipants({ group, onClose }: GroupParticipantsProps) {
    const [activeTab, setActiveTab] = useState<Tab>('members');
    const [members, setMembers] = useState<EnrichedMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [edits, setEdits] = useState<Record<number, string>>({});
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const hasEdits = Object.keys(edits).length > 0;

    const load = async () => {
        setLoading(true);
        setError(null);
        setEdits({});
        setSaveError(null);
        try {
            const groupMembers = await getGroupMembers(group.id);
            const enriched = await Promise.all(
                groupMembers.map(async (m) => {
                    try {
                        const raw = await getStudentRaw(m.studentId);
                        return { ...m, employee: mapEmployee(raw) };
                    } catch {
                        return { ...m, employee: null };
                    }
                })
            );
            setMembers(enriched);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [group.id]);

    const handleProgressChange = (memberId: number, value: string) => {
        setEdits(prev => ({ ...prev, [memberId]: value }));
    };

    const handleStep = (m: EnrichedMember, delta: number) => {
        const current = Number(displayValue(m));
        const next = Math.min(100, Math.max(0, current + delta));
        handleProgressChange(m.id, String(next));
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveError(null);
        try {
            const patches = Object.entries(edits).map(([id, val]) => ({
                id: Number(id),
                completionPercent: Math.min(1, Math.max(0, Number(val) / 100)),
            }));
            const updated = await patchGroupMembers(group.id, patches);
            setMembers(prev => prev.map(m => {
                const u = updated.find(u => u.id === m.id);
                return u ? { ...m, completionPercent: u.completionPercent } : m;
            }));
            setEdits({});
        } catch (e: unknown) {
            setSaveError(e instanceof Error ? e.message : 'Ошибка сохранения');
        } finally {
            setSaving(false);
        }
    };

    const toPercent = (v: number) => v * 100;

    const displayValue = (m: EnrichedMember) =>
        m.id in edits ? edits[m.id] : toPercent(m.completionPercent).toFixed(0);

    const barWidth = (m: EnrichedMember) => {
        if (m.id in edits) return Math.min(100, Math.max(0, Number(edits[m.id])));
        return Math.min(100, toPercent(m.completionPercent));
    };

    const avgProgress = members.length > 0
        ? members.reduce((s, m) => s + toPercent(m.completionPercent), 0) / members.length
        : 0;

    const existingStudentIds = new Set(members.map(m => m.studentId));

    const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
        { key: 'members', label: 'Участники', icon: <Users className="w-4 h-4" /> },
        { key: 'certificates', label: 'Сертификаты', icon: <Award className="w-4 h-4" /> },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Группа</h3>
                            <p className="text-sm text-gray-500">{group.courseName ?? `Группа #${group.id}`}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {!loading && !saving && activeTab === 'members' && (
                            <>
                                <button
                                    onClick={load}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Обновить
                                </button>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
                                >
                                    <UserPlus className="w-3.5 h-3.5" />
                                    Добавить
                                </button>
                            </>
                        )}
                        <button
                            onClick={onClose}
                            disabled={saving}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    {loading && (
                        <div className="p-16 flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                            <p className="text-sm text-gray-500">Загрузка участников...</p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="m-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {!loading && !error && activeTab === 'members' && (
                        <MembersTab
                            members={members}
                            edits={edits}
                            saving={saving}
                            displayValue={displayValue}
                            barWidth={barWidth}
                            handleProgressChange={handleProgressChange}
                            handleStep={handleStep}
                        />
                    )}

                    {!loading && !error && activeTab === 'certificates' && (
                        <CertificatesTab members={members} groupId={group.id} />
                    )}
                </div>

                {/* Footer — только для вкладки участников */}
                {!loading && !error && activeTab === 'members' && members.length > 0 && (
                    <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between shrink-0">
                        <div className="text-sm text-gray-500 flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-primary-500" />
                                Всего: <span className="font-medium text-gray-700 ml-1">{members.length}</span>
                            </span>
                            <span>
                                Ср. прогресс:{' '}
                                <span className="font-medium text-gray-700">{avgProgress.toFixed(0)}%</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {saveError && (
                                <span className="text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {saveError}
                                </span>
                            )}
                            <button
                                onClick={handleSave}
                                disabled={!hasEdits || saving}
                                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {saving ? 'Сохранение...' : 'Сохранить изменения'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showAddModal && (
                <AddParticipantModal
                    groupId={group.id}
                    existingStudentIds={existingStudentIds}
                    onClose={() => setShowAddModal(false)}
                    onAdded={() => {
                        setShowAddModal(false);
                        load();
                    }}
                />
            )}
        </div>
    );
}

/* ── Вкладка Участники ─────────────────────────────────── */

interface MembersTabProps {
    members: EnrichedMember[];
    edits: Record<number, string>;
    saving: boolean;
    displayValue: (m: EnrichedMember) => string;
    barWidth: (m: EnrichedMember) => number;
    handleProgressChange: (id: number, val: string) => void;
    handleStep: (m: EnrichedMember, delta: number) => void;
}

function MembersTab({ members, edits, saving, displayValue, barWidth, handleProgressChange, handleStep }: MembersTabProps) {
    if (members.length === 0) {
        return (
            <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
                <Users className="w-10 h-10" />
                <span className="text-sm">В группе нет участников</span>
            </div>
        );
    }
    return (
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 w-10">#</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">ФИО</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 w-72">Прогресс</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {members.map((m, i) => {
                    const pct = barWidth(m);
                    const isEdited = m.id in edits;
                    return (
                        <tr key={m.id} className={`transition-colors ${isEdited ? 'bg-primary-50' : 'hover:bg-gray-50'}`}>
                            <td className="py-3 px-4 text-gray-400">{i + 1}</td>
                            <td className="py-3 px-4">
                                {m.employee
                                    ? <span className="font-medium text-gray-900">{m.employee.fullName}</span>
                                    : <span className="text-gray-400 italic">Студент #{m.studentId}</span>}
                            </td>
                            <td className="py-3 px-4 text-gray-500">{m.employee?.email ?? '—'}</td>
                            <td className="py-2.5 px-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${pct >= 80 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-primary-500'}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <div className={`flex items-center rounded-xl border transition-all ${isEdited ? 'border-primary-400 shadow-sm shadow-primary-100' : 'border-gray-200'} bg-white overflow-hidden`}>
                                        <button
                                            type="button"
                                            onClick={() => handleStep(m, -1)}
                                            disabled={saving || Number(displayValue(m)) <= 0}
                                            className="flex items-center justify-center w-7 h-8 text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-r border-gray-200"
                                        >
                                            <ChevronDown className="w-3.5 h-3.5" />
                                        </button>
                                        <div className="flex items-center gap-0.5 px-2">
                                            <input
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={displayValue(m)}
                                                onChange={e => handleProgressChange(m.id, e.target.value)}
                                                disabled={saving}
                                                className="w-9 text-sm font-semibold text-center tabular-nums bg-transparent focus:outline-none disabled:opacity-50 text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <span className="text-sm font-medium text-gray-400">%</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleStep(m, 1)}
                                            disabled={saving || Number(displayValue(m)) >= 100}
                                            className="flex items-center justify-center w-7 h-8 text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-l border-gray-200"
                                        >
                                            <ChevronUp className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

/* ── Вкладка Сертификаты ───────────────────────────────── */

interface CertificatesTabProps {
    members: EnrichedMember[];
    groupId: number;
}

type CertState = { status: 'idle' } | { status: 'loading' } | { status: 'done'; certId: string } | { status: 'error'; message: string };

function CertificatesTab({ members, groupId }: CertificatesTabProps) {
    const [certStates, setCertStates] = useState<Record<number, CertState>>({});
    const [viewLoading, setViewLoading] = useState<Record<number, boolean>>({});

    const getState = (studentId: number): CertState =>
        certStates[studentId] ?? { status: 'idle' };

    const handleIssue = async (studentId: number) => {
        setCertStates(prev => ({ ...prev, [studentId]: { status: 'loading' } }));
        try {
            const certId = await createCertificate(studentId, groupId);
            setCertStates(prev => ({ ...prev, [studentId]: { status: 'done', certId } }));
        } catch (e: unknown) {
            setCertStates(prev => ({
                ...prev,
                [studentId]: { status: 'error', message: e instanceof Error ? e.message : 'Ошибка' },
            }));
        }
    };

    const handleView = async (studentId: number, certId?: string) => {
        setViewLoading(prev => ({ ...prev, [studentId]: true }));
        try {
            const blob = await getCertificatePdf(
                certId ? { certificateId: certId } : { studentId, groupId }
            );
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            setTimeout(() => URL.revokeObjectURL(url), 10000);
        } catch {
            // ignore — browser will show nothing
        } finally {
            setViewLoading(prev => ({ ...prev, [studentId]: false }));
        }
    };

    if (members.length === 0) {
        return (
            <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
                <Award className="w-10 h-10" />
                <span className="text-sm">В группе нет участников</span>
            </div>
        );
    }

    return (
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 w-10">#</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">ФИО</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 w-64">Сертификат</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {members.map((m, i) => {
                    const state = getState(m.studentId);
                    const isViewing = viewLoading[m.studentId] ?? false;
                    const certId = state.status === 'done' ? state.certId : undefined;
                    return (
                        <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 text-gray-400">{i + 1}</td>
                            <td className="py-3 px-4">
                                {m.employee
                                    ? <span className="font-medium text-gray-900">{m.employee.fullName}</span>
                                    : <span className="text-gray-400 italic">Студент #{m.studentId}</span>}
                            </td>
                            <td className="py-3 px-4 text-gray-500">{m.employee?.email ?? '—'}</td>
                            <td className="py-2.5 px-4">
                                <div className="flex items-center gap-2">
                                    {/* Выдать */}
                                    <button
                                        onClick={() => handleIssue(m.studentId)}
                                        disabled={state.status === 'loading' || state.status === 'done'}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors
                                            disabled:cursor-not-allowed
                                            border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100
                                            disabled:opacity-40"
                                    >
                                        {state.status === 'loading'
                                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            : state.status === 'done'
                                                ? <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                                : <Award className="w-3.5 h-3.5" />}
                                        {state.status === 'done' ? 'Выдан' : 'Выдать'}
                                    </button>

                                    {/* Просмотреть */}
                                    <button
                                        onClick={() => handleView(m.studentId, certId)}
                                        disabled={isViewing}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {isViewing
                                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            : <Eye className="w-3.5 h-3.5" />}
                                        Просмотреть
                                    </button>

                                    {state.status === 'error' && (
                                        <span className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {state.message}
                                        </span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

/* ── Модалка добавления участника ──────────────────────── */

interface AddParticipantModalProps {
    groupId: number;
    existingStudentIds: Set<number>;
    onClose: () => void;
    onAdded: () => void;
}

function AddParticipantModal({ groupId, existingStudentIds, onClose, onAdded }: AddParticipantModalProps) {
    const employees = useERPStore(state => state.employees);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const available = employees.filter(e =>
        !existingStudentIds.has(e.id) &&
        e.fullName.toLowerCase().includes(search.toLowerCase())
    );

    const toggle = (id: number) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleAdd = async () => {
        if (selected.size === 0) return;
        setAdding(true);
        setError(null);
        try {
            await addStudentsToGroup(groupId, [...selected]);
            onAdded();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Ошибка добавления');
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[70vh]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
                    <div className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary-500" />
                        <h3 className="font-semibold text-gray-900">Добавить участников</h3>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="px-5 py-3 border-b border-gray-100 shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Поиск по имени..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    {available.length === 0 ? (
                        <div className="py-12 text-center text-sm text-gray-400">
                            {search ? 'Ничего не найдено' : 'Все сотрудники уже в группе'}
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {available.map(e => (
                                <li
                                    key={e.id}
                                    onClick={() => toggle(e.id)}
                                    className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors ${selected.has(e.id) ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                                >
                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${selected.has(e.id) ? 'bg-primary-500 border-primary-500' : 'border-gray-300'}`}>
                                        {selected.has(e.id) && (
                                            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                                                <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium text-gray-900 truncate">{e.fullName}</div>
                                        <div className="text-xs text-gray-400 truncate">{e.email}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {!loading && !error && members.length > 0 && (
                    <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between shrink-0">
                        <div className="text-sm text-gray-500 flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-primary-500" />
                                Всего: <span className="font-medium text-gray-700 ml-1">{members.length}</span>
                            </span>
                            <span>
                                Ср. прогресс:{' '}
                                <span className="font-medium text-gray-700">{avgProgress.toFixed(0)}%</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {saveError && (
                                <span className="text-xs text-danger flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {saveError}
                                </span>
                            )}
                            <button
                                onClick={handleSave}
                                disabled={!hasEdits || saving}
                                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {saving
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : <Save className="w-4 h-4" />
                                }
                                {saving ? 'Сохранение...' : 'Сохранить изменения'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
