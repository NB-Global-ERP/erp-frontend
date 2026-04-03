import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useERPStore } from '@/stores/erpStore';
import { X } from 'lucide-react';

const employeeSchema = z.object({
    fullName: z.string().min(1, 'Введите ФИО'),
    email: z.string().email('Введите корректный email'),
    companyId: z.string().min(1, 'Выберите компанию'),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
    employeeId?: string | null;
    onClose: () => void;
    onSave: () => void;
}

export function EmployeeForm({ employeeId, onClose, onSave }: EmployeeFormProps) {
    const employees = useERPStore((state) => state.employees);
    const companies = useERPStore((state) => state.companies);
    const addEmployee = useERPStore((state) => state.addEmployee);
    const updateEmployee = useERPStore((state) => state.updateEmployee);

    const existingEmployee = employeeId ? employees.find(e => e.id === employeeId) : null;

    const { register, handleSubmit, formState: { errors } } = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
        defaultValues: existingEmployee ? {
            fullName: existingEmployee.fullName,
            email: existingEmployee.email,
            companyId: existingEmployee.companyId,
        } : {
            fullName: '',
            email: '',
            companyId: '',
        },
    });

    const onSubmit = (data: EmployeeFormData) => {
        if (employeeId) {
            updateEmployee(employeeId, data);
        } else {
            addEmployee({
                id: Date.now().toString(),
                ...data,
                groupIds: [],
            });
        }
        onSave();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {employeeId ? 'Редактирование сотрудника' : 'Новый сотрудник'}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ФИО *
                        </label>
                        <input
                            {...register('fullName')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Иванов Иван Иванович"
                        />
                        {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            {...register('email')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="ivanov@example.com"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Компания *
                        </label>
                        <select
                            {...register('companyId')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">Выберите компанию</option>
                            {companies.map(company => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                        {errors.companyId && <p className="mt-1 text-sm text-red-600">{errors.companyId.message}</p>}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                        >
                            {employeeId ? 'Сохранить' : 'Создать'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}