import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useERPStore } from '@/stores/erpStore';
// import { GroupParticipants } from './GroupParticipants';
import { X } from 'lucide-react';
import type {TrainingGroup} from "@/types/erp.types.ts";

const groupSchema = z.object({
    courseId: z.number().min(1, 'Выберите курс'),
    dateBegin: z.string().min(1, 'Укажите дату начала'),
    courseCompletionId: z.number().min(1, 'Выберите статус'),
    specificationId: z.number().min(1, 'Выберите спецификацию'),
});

type GroupFormData = z.infer<typeof groupSchema>;

interface TrainingGroupFormProps {
    group?: TrainingGroup | null;
    onClose: () => void;
    onSave: () => void;
}

export function TrainingGroupForm({ group, onClose, onSave }: TrainingGroupFormProps) {
    const [activeTab, setActiveTab] = useState<'info' | 'participants'>('info');
    const [showConfirm, setShowConfirm] = useState(false);

    const courses = useERPStore((state) => state.courses);
    const specifications = useERPStore((state) => state.specifications);
    const statuses = useERPStore((state) => state.statuses);
    const addGroup = useERPStore((state) => state.addGroup);
    const updateGroup = useERPStore((state) => state.updateGroup);
    const deleteGroup = useERPStore((state) => state.deleteGroup);

    const isEditing = !!group;

    const getStatusIdByName = (statusName: string) => {
        const status = statuses.find(s => s.name === statusName);
        return status?.id || 1;
    };

    const { register, handleSubmit, formState: { errors } } = useForm<GroupFormData>({
        resolver: zodResolver(groupSchema),
        defaultValues: group ? {
            courseId: group.courseId,
            dateBegin: group.startDate.toISOString().split('T')[0],
            courseCompletionId: getStatusIdByName(group.status),
            specificationId: group.specificationId,
        } : {
            courseId: undefined,
            dateBegin: new Date().toISOString().split('T')[0],
            courseCompletionId: undefined,
            specificationId: undefined,
        },
    });

    const onSubmit = async (data: GroupFormData) => {

        const requestData = {
            courseId: data.courseId,
            dateBegin: new Date(data.dateBegin).toISOString(),
            courseCompletionId: data.courseCompletionId,
            specificationId: data.specificationId || 0,
        };

        if (isEditing && group) {
            await updateGroup(group.id, requestData);
        } else {
            await addGroup(requestData);
        }
        onSave();
    };

    const handleDeleteClick = () => {
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (group) {
            await deleteGroup(group.id);
            setShowConfirm(false);
            onSave();
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {isEditing ? 'Редактирование группы' : 'Создание группы'}
                        </h2>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="flex border-b border-gray-200 px-6">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`px-4 py-2 font-medium transition-colors ${
                                activeTab === 'info'
                                    ? 'border-b-2 border-primary-500 text-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Основная информация
                        </button>
                        <button
                            onClick={() => setActiveTab('participants')}
                            className={`px-4 py-2 font-medium transition-colors ${
                                activeTab === 'participants'
                                    ? 'border-b-2 border-primary-500 text-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Участники
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                        {activeTab === 'info' && (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Курс обучения *
                                    </label>
                                    <select
                                        {...register('courseId', { valueAsNumber: true })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="">Выберите курс</option>
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>
                                                {course.name} ({course.price.toLocaleString('ru-RU')} ₽/чел)
                                            </option>
                                        ))}
                                    </select>
                                    {errors.courseId && (
                                        <p className="mt-1 text-sm text-red-600">{errors.courseId.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Дата начала *
                                    </label>
                                    <input
                                        type="date"
                                        {...register('dateBegin')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    />
                                    {errors.dateBegin && (
                                        <p className="mt-1 text-sm text-red-600">{errors.dateBegin.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Статус *
                                    </label>
                                    <select
                                        {...register('courseCompletionId', {valueAsNumber: true})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="">Выберите статус</option>
                                        {statuses.map(status => (
                                            <option key={status.id} value={status.id}>
                                                {status.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.courseCompletionId && (
                                        <p className="mt-1 text-sm text-red-600">{errors.courseCompletionId.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Спецификация *
                                    </label>
                                    <select
                                        {...register('specificationId', { valueAsNumber: true })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="">Выберите спецификацию</option>
                                        {specifications.map(spec => (
                                            <option key={spec.id} value={spec.id}>
                                                Спецификация №{spec.number} от {spec.date.toLocaleDateString('ru-RU')}
                                            </option>
                                        ))}
                                    </select>
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
                        )}

                        {/*activeTab === 'participants' && group && (*/}
                        {/*    <GroupParticipants group={group} />*/}
                        {/*)*/}

                        {activeTab === 'participants' && !isEditing && (
                            <div className="text-center py-8 text-gray-500">
                                Сначала сохраните группу, чтобы добавить участников
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Подтверждение удаления
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Вы уверены, что хотите удалить группу?
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