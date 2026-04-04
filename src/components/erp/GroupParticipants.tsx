import { useState } from 'react';
import {ContextMenu, Grid, HeaderMenu} from '@svar-ui/react-grid';
import { useERPStore } from '@/stores/erpStore';
import { Plus, Trash2 } from 'lucide-react';
import ru from "@/utils/ru.ts";
import {Locale} from "@svar-ui/react-core";

interface GroupParticipantsProps {
    groupId: number;
}

export function GroupParticipants({ groupId }: GroupParticipantsProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [api, setApi] = useState(null);

    const participants = useERPStore((state) =>
        state.participants.filter(p => p.groupId === groupId)
    );
    const employees = useERPStore((state) => state.employees);
    const addParticipant = useERPStore((state) => state.addParticipant);
    const updateParticipant = useERPStore((state) => state.updateParticipant);
    const removeParticipant = useERPStore((state) => state.removeParticipant);

    const participantsWithNames = participants.map(p => ({
        ...p,
        employeeName: employees.find(e => e.id === p.employeeId)?.fullName || 'Неизвестно',
    }));

    const columns = [
        { id: 'employeeName', header: 'Сотрудник', width: 250 },
        {
            id: 'progressPercent',
            header: 'Прогресс, %',
            width: 150,
            editable: true,
            editor: 'number',
        },
        {
            id: 'actions',
            header: '',
            width: 80,
            format: (value: any, row: any) => (
                <button
                    onClick={() => removeParticipant(row.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            ),
        },
    ];

    const handleCellEdit = (newValue: any, row: any, column: any) => {
        if (column.id === 'progressPercent') {
            updateParticipant(row.id, { progressPercent: Math.min(100, Math.max(0, newValue)) });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-800">Участники группы</h3>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Добавить участника
                </button>
            </div>

            <Locale words={{ ...ru, ...ru }}>
                <ContextMenu api={api}>
                    <HeaderMenu api={api}>
                        <Grid
                            init={setApi}
                            data={participantsWithNames}
                            columns={columns}
                            onCellEdit={handleCellEdit}
                            style={{ height: 300 }}
                        />
                    </HeaderMenu>
                </ContextMenu>
            </Locale>

            {showAddModal && (
                <AddParticipantModal
                    groupId={groupId}
                    onClose={() => setShowAddModal(false)}
                    onAdd={(employeeId) => {
                        addParticipant({
                            id: Date.now().toString(),
                            groupId,
                            employeeId,
                            progressPercent: 0,
                        });
                        setShowAddModal(false);
                    }}
                />
            )}
        </div>
    );
}

function AddParticipantModal({ groupId, onClose, onAdd }: any) {
    const employees = useERPStore((state) => state.employees);
    const existingParticipantIds = useERPStore((state) =>
        state.participants.filter(p => p.groupId === groupId).map(p => p.employeeId)
    );

    const availableEmployees = employees.filter(e => !existingParticipantIds.includes(e.id));
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Добавить участника</h3>
                </div>
                <div className="p-6">
                    <select
                        value={selectedEmployeeId}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">Выберите сотрудника</option>
                        {availableEmployees.map(emp => (
                            <option key={emp.id} value={emp.id}>
                                {emp.fullName} ({emp.email})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={() => selectedEmployeeId && onAdd(selectedEmployeeId)}
                        disabled={!selectedEmployeeId}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                    >
                        Добавить
                    </button>
                </div>
            </div>
        </div>
    );
}