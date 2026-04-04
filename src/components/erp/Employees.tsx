import { useState } from 'react';
import {ContextMenu, Grid, HeaderMenu, type IApi, type IFilterValues} from '@svar-ui/react-grid';
import { EmployeeForm } from './EmployeeForm';
import { Plus } from 'lucide-react';
import ru from "@/utils/ru.ts";
import {Locale} from "@svar-ui/react-core";
import {useEmployees} from "@/hooks/useEmployees.ts";
import {useCompanies} from "@/hooks/useCompanies.ts";

export function Employees() {
    const [showForm, setShowForm] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
    const [api, setApi] = useState<IApi>();
    const [filterValues, setFilterValues] = useState<IFilterValues>({});

    const employees = useEmployees()
    const companies = useCompanies();

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
                            data={employeesWithCompany}
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