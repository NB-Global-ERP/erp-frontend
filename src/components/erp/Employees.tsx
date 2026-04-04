import { useState } from 'react';
import {ContextMenu, Grid, HeaderMenu} from '@svar-ui/react-grid';
import { useERPStore } from '@/stores/erpStore';
import { EmployeeForm } from './EmployeeForm';
import { Plus } from 'lucide-react';
import ru from "@/utils/ru.ts";
import {Locale} from "@svar-ui/react-core";

export function Employees() {
    const [showForm, setShowForm] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [api, setApi] = useState(null);

    const employees = useERPStore((state) => state.employees);
    const companies = useERPStore((state) => state.companies);

    const employeesWithCompany = employees.map(emp => ({
        ...emp,
        companyName: companies.find(c => c.id === emp.companyId)?.name || '',
    }));

    const columns = [
        { id: 'fullName', header: 'ФИО', width: 250 },
        { id: 'email', header: 'Email', width: 250 },
        { id: 'companyName', header: 'Компания', width: 200 },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Участники обучения</h2>
                <button
                    onClick={() => {
                        setSelectedEmployeeId(null);
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                    <Plus className="w-4 h-4" />
                    Добавить сотрудника
                </button>
            </div>

            <Locale words={{ ...ru, ...ru }}>
                <ContextMenu api={api}>
                    <HeaderMenu api={api}>
                        <Grid
                            init={setApi}
                            data={employeesWithCompany}
                            columns={columns}
                            onRowDoubleClick={(row) => {
                                setSelectedEmployeeId(row.id);
                                setShowForm(true);
                            }}
                        />
                    </HeaderMenu>
                </ContextMenu>
            </Locale>

            {showForm && (
                <EmployeeForm
                    employeeId={selectedEmployeeId}
                    onClose={() => setShowForm(false)}
                    onSave={() => setShowForm(false)}
                />
            )}
        </div>
    );
}