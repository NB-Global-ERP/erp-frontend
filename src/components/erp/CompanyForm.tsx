import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useERPStore } from '@/stores/erpStore';
import { X } from 'lucide-react';
import type {Company} from "@/types/erp.types.ts";
import {useState} from "react";

const companySchema = z.object({
    companyCode: z.string()
        .min(1, 'Введите код компании')
        .max(4, 'Код должен быть не более 4 символов'),
    companyName: z.string().min(1, 'Введите название компании'),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormProps {
    company?: Company | null;
    onClose: () => void;
    onSave: () => void;
}

export function CompanyForm({ company, onClose, onSave }: CompanyFormProps) {
    const [showConfirm, setShowConfirm] = useState(false);

    const addCompany = useERPStore((state) => state.addCompany);
    const updateCompany = useERPStore((state) => state.updateCompany);
    const deleteCompany = useERPStore((state) => state.deleteCompany);

    const isEditing = !!company;

    const { register, handleSubmit, formState: { errors } } = useForm<CompanyFormData>({
        resolver: zodResolver(companySchema),
        defaultValues: company
            ? {
                companyCode: company.code,
                companyName: company.name,
            }
            : {
                companyCode: '',
                companyName: '',
            },
    });

    const onSubmit = async (data: CompanyFormData) => {
        if (isEditing && company) {
            await updateCompany(company.id, {
                companyCode: data.companyCode,
                companyName: data.companyName,
            });
        } else {
            await addCompany({
                companyCode: data.companyCode,
                companyName: data.companyName,
            });
        }
        onSave();
    };

    const handleDeleteClick = () => {
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (company) {
            await deleteCompany(company.id);
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
                            {isEditing ? 'Редактирование компании' : 'Новая компания'}
                        </h2>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Код компании *
                            </label>
                            <input
                                {...register('companyCode')}
                                placeholder="Например: ROM"
                                maxLength={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            {errors.companyCode && (
                                <p className="mt-1 text-sm text-red-600">{errors.companyCode.message}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Код должен содержать не более 4 символов
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Название компании *
                            </label>
                            <input
                                {...register('companyName')}
                                placeholder="Например: ООО Ромашка"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            {errors.companyName && (
                                <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                            )}
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
                            Вы уверены, что хотите удалить компанию "{company?.name}"?
                            Это действие нельзя отменить.
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