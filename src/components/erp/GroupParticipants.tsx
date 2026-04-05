import { useEffect, useState } from 'react';
import { X, Loader2, AlertCircle, Users, RefreshCw, Save, ChevronUp, ChevronDown } from 'lucide-react';
import { getGroupMembers, patchGroupMembers } from '@/services/api';
import { getStudentRaw } from '@/services/rawApi';
import { mapEmployee } from '@/utils/adapters';
import type { TrainingGroup, GroupMember, Employee } from '@/types/erp.types';

interface EnrichedMember extends GroupMember {
    employee: Employee | null;
}

interface GroupParticipantsProps {
    group: TrainingGroup & { courseName?: string };
    onClose: () => void;
}

export function GroupParticipants({ group, onClose }: GroupParticipantsProps) {
    const [members, setMembers] = useState<EnrichedMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [edits, setEdits] = useState<Record<number, string>>({});
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

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
            // merge updated values into local state
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

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Участники группы</h3>
                            <p className="text-sm text-gray-500">{group.courseName ?? `Группа #${group.id}`}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {!loading && !saving && (
                            <button
                                onClick={load}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Обновить
                            </button>
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

                    {!loading && !error && (
                        <>
                            {members.length === 0 ? (
                                <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
                                    <Users className="w-10 h-10" />
                                    <span className="text-sm">В группе нет участников</span>
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50">
                                            <th className="text-left py-3 px-4 font-medium text-gray-500 w-10">#</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">ФИО</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-500 w-52">Прогресс</th>
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
                                                        {m.employee ? (
                                                            <span className="font-medium text-gray-900">{m.employee.fullName}</span>
                                                        ) : (
                                                            <span className="text-gray-400 italic">Студент #{m.studentId}</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-500">
                                                        {m.employee?.email ?? '—'}
                                                    </td>
                                                    <td className="py-2.5 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full transition-all ${
                                                                        pct >= 80 ? 'bg-green-500' :
                                                                        pct >= 40 ? 'bg-yellow-500' :
                                                                        'bg-primary-500'
                                                                    }`}
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
                            )}
                        </>
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
