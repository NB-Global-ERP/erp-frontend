import { useState } from 'react';
import {ContextMenu, Grid, HeaderMenu, type IApi, type IFilterValues} from '@svar-ui/react-grid';
import { EmployeeForm } from './EmployeeForm';
import { Plus } from 'lucide-react';
import ru from "@/utils/ru.ts";
import {Locale} from "@svar-ui/react-core";
import {useEmployees} from "@/hooks/useEmployees.ts";

export function Employees() {
    const [showForm, setShowForm] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [api, setApi] = useState<IApi>();
    const [filterValues, setFilterValues] = useState<IFilterValues>({});

    const {employees, isLoading } = useEmployees();

    const columns = [
        { id: 'fullName', header: 'ФИО', width: 250 },
        { id: 'email', header: 'Email', width: 250 },
        { id: 'companyName', header: 'Компания', width: 200 },
    ];

    if (isLoading && employees.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Загрузка участников...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Участники обучения</h2>
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
                            data={employees}
                            columns={columns}
                            filterValues={filterValues}
                            onFilterChange={setFilterValues}
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