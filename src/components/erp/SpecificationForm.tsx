import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useERPStore } from '@/stores/erpStore';
import { X } from 'lucide-react';
import { formatCurrency } from "@/utils/formatters.ts";

const specSchema = z.object({
    datetime: z.string().min(1, 'Укажите дату'),
    number: z.number().min(1, 'Введите номер'),
    companyId: z.number().min(1, 'Выберите компанию'),
});

type SpecFormData = z.infer<typeof specSchema>;

interface SpecificationFormProps {
    specId?: number | null;
    onClose: () => void;
    onSave: () => void;
}

export function SpecificationForm({ specId, onClose, onSave }: SpecificationFormProps) {
    const specifications = useERPStore((state) => state.specifications);
    const companies = useERPStore((state) => state.companies);
    const groups = useERPStore((state) => state.groups);
    const courses = useERPStore((state) => state.courses);
    const addSpecification = useERPStore((state) => state.addSpecification);
    const updateSpecification = useERPStore((state) => state.updateSpecification);

    const existingSpec = specId ? specifications.find(s => s.id === specId) : null;

    const linkedGroups = groups.filter(g => g.specificationId === specId);

    const totalAmount = linkedGroups.reduce((sum, g) => sum + (g.totalCost || 0), 0);
    const vatAmount = totalAmount * 0.22;
    const totalWithVat = totalAmount + vatAmount;

    const { register, handleSubmit, formState: { errors } } = useForm<SpecFormData>({
        resolver: zodResolver(specSchema),
        defaultValues: existingSpec
            ? {
                datetime: existingSpec.date.toISOString().split('T')[0],
                number: existingSpec.number,
                companyId: existingSpec.companyId,
            }
            : {
                datetime: new Date().toISOString().split('T')[0],
                number: 1,
                companyId: undefined,
            },
    });

    const onSubmit = async (data: SpecFormData) => {
        const dateTime = new Date(data.datetime);
        const isoDateTime = dateTime.toISOString();

        const requestData = {
            datetime: isoDateTime,
            number: data.number,
            companyId: data.companyId,
            totalAmountExcludingVat: totalAmount,
            vatAmount22Percent: vatAmount,
            totalAmountIncludingVat: totalWithVat,
        };

        if (specId) {
            await updateSpecification(specId, requestData);
        } else {
            await addSpecification(requestData);
        }
        onSave();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {specId ? 'Редактирование спецификации' : 'Создание спецификации'}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Номер спецификации *
                                </label>
                                <input
                                    type="number"
                                    {...register('number', { valueAsNumber: true })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                                {errors.number && (
                                    <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Дата *
                                </label>
                                <input
                                    type="date"
                                    {...register('datetime')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                                {errors.datetime && (
                                    <p className="mt-1 text-sm text-red-600">{errors.datetime.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Компания *
                            </label>
                            <select
                                {...register('companyId', { valueAsNumber: true })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Выберите компанию</option>
                                {companies.map(company => (
                                    <option key={company.id} value={company.id}>
                                        {company.name} ({company.code})
                                    </option>
                                ))}
                            </select>
                            {errors.companyId && (
                                <p className="mt-1 text-sm text-red-600">{errors.companyId.message}</p>
                            )}
                        </div>
                    </form>

                    {specId && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Группы в спецификации
                            </label>
                            <div className="border border-gray-200 rounded-lg divide-y max-h-60 overflow-y-auto">
                                {linkedGroups.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">
                                        Нет привязанных групп
                                    </div>
                                ) : (
                                    linkedGroups.map(group => {
                                        const course = courses.find(c => c.id === group.courseId);
                                        return (
                                            <div key={group.id} className="flex items-center justify-between p-3">
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {course?.name || `Курс ${group.courseId}`}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {group.participantCount || 0} участников
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-gray-800">
                                                        {formatCurrency(group.totalCost || 0)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}

                    {specId && linkedGroups.length > 0 && (
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
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
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