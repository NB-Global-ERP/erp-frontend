import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useERPStore } from '@/stores/erpStore';
import { X } from 'lucide-react';
import type {Employee} from "@/types/erp.types.ts";
import {useState} from "react";

const employeeSchema = z.object({
    firstName: z.string().min(1, 'Введите имя'),
    middleName: z.string().min(1, 'Введите отчество'),
    lastName: z.string().min(1, 'Введите фамилию'),
    companyId: z.number().min(1, 'Выберите компанию'),
    email: z.string().email('Введите email'),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
    employee?: Employee | null;
    onClose: () => void;
    onSave: () => void;
}

export function EmployeeForm({ employee, onClose, onSave }: EmployeeFormProps) {
    const [showConfirm, setShowConfirm] = useState(false);

    const companies = useERPStore((state) => state.companies);
    const addEmployee = useERPStore((state) => state.addEmployee);
    const updateEmployee = useERPStore((state) => state.updateEmployee);
    const deleteEmployee = useERPStore((state) => state.deleteEmployee);


    const isEditing = !!employee;

    const { register, handleSubmit, formState: { errors } } = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
        defaultValues: employee || {},
    });

    const onSubmit = async (data: EmployeeFormData) => {
        if (isEditing && employee) await updateEmployee(employee.id, data);
        else await addEmployee(data);
        onSave();
    };

    const handleDeleteClick = () => {
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (employee) {
            await deleteEmployee(employee.id);
            setShowConfirm(false);
            onSave();
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {isEditing ? 'Редактирование сотрудника' : 'Новый сотрудник'}
                        </h2>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                            <X className="w-5 h-5 text-gray-500"/>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Фамилия *
                            </label>
                            <input
                                {...register('lastName')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Иванов"
                            />
                            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Имя *
                            </label>
                            <input
                                {...register('firstName')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Иван"
                            />
                            {errors.firstName &&
                                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Отчество *
                            </label>
                            <input
                                {...register('middleName')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Иванович"
                            />
                            {errors.middleName &&
                                <p className="mt-1 text-sm text-red-600">{errors.middleName.message}</p>}
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
                                {...register('companyId', {valueAsNumber: true})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Выберите компанию</option>
                                {companies.map(company => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                            {errors.companyId &&
                                <p className="mt-1 text-sm text-red-600">{errors.companyId.message}</p>}
                        </div>

                        <div className="flex justify-between gap-3 pt-4">
                            {isEditing &&
                                <div>
                                    <button
                                        type="button"
                                        onClick={handleDeleteClick}
                                        className="px-4 py-2 border border-danger text-danger rounded-lg hover:bg-danger hover:text-white transition-colors"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            }
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                                >
                                    {isEditing ? 'Сохранить' : 'Создать'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Подтверждение удаления
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Вы уверены, что хотите удалить сотрудника?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}