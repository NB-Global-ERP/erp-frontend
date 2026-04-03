import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useERPStore } from '@/stores/erpStore';
import { X } from 'lucide-react';
import {formatCurrency} from "@/utils/formatters.ts";

const specSchema = z.object({
    number: z.string().min(1, 'Введите номер'),
    date: z.string().min(1, 'Укажите дату'),
    companyId: z.string().min(1, 'Выберите компанию'),
});

type SpecFormData = z.infer<typeof specSchema>;

interface SpecificationFormProps {
    specId?: string | null;
    onClose: () => void;
    onSave: () => void;
}

export function SpecificationForm({ specId, onClose, onSave }: SpecificationFormProps) {
    const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);

    const companies = useERPStore((state) => state.companies);
    const specifications = useERPStore((state) => state.specifications);
    const groups = useERPStore((state) => state.getGroupsWithCalculations());
    const addSpecification = useERPStore((state) => state.addSpecification);
    const updateSpecification = useERPStore((state) => state.updateSpecification);

    const existingSpec = specId ? specifications.find(s => s.id === specId) : null;

    const { register, handleSubmit, formState: { errors } } = useForm<SpecFormData>({
        resolver: zodResolver(specSchema),
        defaultValues: existingSpec ? {
            number: existingSpec.number,
            date: existingSpec.date.toISOString().split('T')[0],
            companyId: existingSpec.companyId,
        } : {
            number: '',
            date: new Date().toISOString().split('T')[0],
            companyId: '',
        },
    });

    useEffect(() => {
        if (existingSpec) {
            setSelectedGroupIds(existingSpec.groupIds);
        }
    }, [existingSpec]);

    const availableGroups = groups.filter(g => !g.specificationId || g.specificationId === specId);

    const selectedGroups = groups.filter(g => selectedGroupIds.includes(g.id));
    const totalAmount = selectedGroups.reduce((sum, g) => sum + g.totalCost, 0);
    const vatAmount = totalAmount * 0.22;
    const totalWithVat = totalAmount + vatAmount;

    const onSubmit = (data: SpecFormData) => {
        if (specId) {
            updateSpecification(specId, {
                number: data.number,
                date: new Date(data.date),
                companyId: data.companyId,
                groupIds: selectedGroupIds,
            });
        } else {
            addSpecification({
                id: Date.now().toString(),
                documentId: Date.now().toString(),
                number: data.number,
                date: new Date(data.date),
                companyId: data.companyId,
                groupIds: selectedGroupIds,
                totalAmount: 0,
                vatAmount: 0,
                totalWithVat: 0,
            });
        }
        onSave();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {specId ? 'Редактирование спецификации' : 'Создание спецификации'}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Номер спецификации *
                                </label>
                                <input
                                    {...register('number')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                                {errors.number && <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Дата *
                                </label>
                                <input
                                    type="date"
                                    {...register('date')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
                            </div>
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
                                        {company.name} ({company.code})
                                    </option>
                                ))}
                            </select>
                            {errors.companyId && <p className="mt-1 text-sm text-red-600">{errors.companyId.message}</p>}
                        </div>
                    </form>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Учебные группы
                        </label>
                        <div className="border border-gray-200 rounded-lg divide-y max-h-60 overflow-y-auto">
                            {availableGroups.map(group => {
                                const course = useERPStore.getState().courses.find(c => c.id === group.courseId);
                                return (
                                    <label key={group.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedGroupIds.includes(group.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedGroupIds([...selectedGroupIds, group.id]);
                                                } else {
                                                    setSelectedGroupIds(selectedGroupIds.filter(id => id !== group.id));
                                                }
                                            }}
                                            className="w-4 h-4 text-primary-500 rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">{course?.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {group.participantCount} участников • {formatCurrency(group.totalCost)}
                                            </p>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {selectedGroups.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Сумма без НДС:</span>
                                <span className="font-medium">{formatCurrency(totalAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">НДС (22%):</span>
                                <span className="font-medium">{formatCurrency(vatAmount)}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-gray-200">
                                <span className="font-semibold text-gray-800">Итого с НДС:</span>
                                <span className="font-bold text-primary-600">{formatCurrency(totalWithVat)}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Отмена
                        </button>
                        <button
                            onClick={handleSubmit(onSubmit)}
                            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                        >
                            {specId ? 'Сохранить' : 'Создать'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}