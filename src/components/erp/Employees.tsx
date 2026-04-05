import {useCallback, useState} from 'react';
import {Grid, HeaderMenu, type IApi, type IFilterValues} from '@svar-ui/react-grid';
import { EmployeeForm } from './EmployeeForm';
import { Plus, Pen } from 'lucide-react';
import ru from "@/utils/ru.ts";
import {Locale} from "@svar-ui/react-core";
import {useEmployees} from "@/hooks/useEmployees.ts";
import type {Employee} from "@/types/erp.types.ts";
import {useERPStore} from "@/stores/erpStore.ts";

export function Employees() {
    const [showForm, setShowForm] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [api, setApi] = useState<IApi>();
    const [filterValues, setFilterValues] = useState<IFilterValues>({});

    const {employees } = useEmployees();

    const columns = [
        { id: 'fullName', header: 'ФИО', width: 250 },
        { id: 'email', header: 'Email', width: 250 },
        { id: 'companyName', header: 'Компания', width: 200 },
    ];

    const init = useCallback((gridApi: IApi) => {
        setApi(gridApi);
        gridApi.on('select-row', ({ id }: { id: string | number  }) => {
            const row = gridApi.getRow(id) as Employee;
            if (row) {
                setSelectedEmployee(row);
            }
        });
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Участники обучения</h2>
                <div className="flex gap-4">
                    {!!selectedEmployee && (
                        <button
                            onClick={() => {
                                setShowForm(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors"
                        >
                            <Pen className="w-4 h-4"/>
                            Редактировать сотрудника
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setSelectedEmployee(null);
                            setShowForm(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        <Plus className="w-4 h-4"/>
                        Добавить сотрудника
                    </button>
                </div>
            </div>

            <Locale words={{...ru, ...ru}}>
                <HeaderMenu api={api}>
                    <Grid
                        init={init}
                        data={employees}
                        columns={columns}
                        filterValues={filterValues}
                        onFilterChange={setFilterValues}
                    />
                </HeaderMenu>
            </Locale>

            {showForm && (
                <EmployeeForm
                    employee={selectedEmployee}
                    onClose={() => setShowForm(false)}
                    onSave={() => {
                        setShowForm(false);
                        const fetchAllData = useERPStore.getState().fetchAllData;
                        fetchAllData();
                    }}
                />
            )}
        </div>
    );
}