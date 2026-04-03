import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useERPStore } from '@/stores/erpStore';
import { GroupParticipants } from './GroupParticipants';
import { X } from 'lucide-react';

const groupSchema = z.object({
    courseId: z.string().min(1, 'Выберите курс'),
    startDate: z.string().min(1, 'Укажите дату начала'),
    endDate: z.string().min(1, 'Укажите дату окончания'),
    status: z.enum(['planned', 'in_progress', 'completed', 'cancelled']),
});

type GroupFormData = z.infer<typeof groupSchema>;

interface TrainingGroupFormProps {
    groupId?: string | null;
    onClose: () => void;
    onSave: () => void;
}

export function TrainingGroupForm({ groupId, onClose, onSave }: TrainingGroupFormProps) {
    const [activeTab, setActiveTab] = useState<'info' | 'participants'>('info');

    const courses = useERPStore((state) => state.courses);
    const groups = useERPStore((state) => state.groups);
    const addGroup = useERPStore((state) => state.addGroup);
    const updateGroup = useERPStore((state) => state.updateGroup);

    const existingGroup = groupId ? groups.find(g => g.id === groupId) : null;

    const { register, handleSubmit, formState: { errors }, reset } = useForm<GroupFormData>({
        resolver: zodResolver(groupSchema),
        defaultValues: existingGroup ? {
            courseId: existingGroup.courseId,
            startDate: existingGroup.startDate.toISOString().split('T')[0],
            endDate: existingGroup.endDate.toISOString().split('T')[0],
            status: existingGroup.status,
        } : {
            courseId: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'planned',
        },
    });

    const onSubmit = (data: GroupFormData) => {
        const selectedCourse = courses.find(c => c.id === data.courseId);

        if (groupId) {
            updateGroup(groupId, {
                courseId: data.courseId,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                status: data.status,
                pricePerPerson: selectedCourse?.pricePerPerson || 0,
            });
        } else {
            addGroup({
                id: Date.now().toString(),
                courseId: data.courseId,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                status: data.status,
                pricePerPerson: selectedCourse?.pricePerPerson || 0,
                specificationId: undefined,
                participants: [],
            });
        }
        onSave();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {groupId ? 'Редактирование группы' : 'Создание группы'}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
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

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {activeTab === 'info' && (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Курс обучения *
                                </label>
                                <select
                                    {...register('courseId')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="">Выберите курс</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.name} ({course.pricePerPerson.toLocaleString('ru-RU')} ₽/чел)
                                        </option>
                                    ))}
                                </select>
                                {errors.courseId && (
                                    <p className="mt-1 text-sm text-red-600">{errors.courseId.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Дата начала *
                                    </label>
                                    <input
                                        type="date"
                                        {...register('startDate')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                    {errors.startDate && (
                                        <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Дата окончания *
                                    </label>
                                    <input
                                        type="date"
                                        {...register('endDate')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                    {errors.endDate && (
                                        <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Статус
                                </label>
                                <select
                                    {...register('status')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="planned">Планируется</option>
                                    <option value="in_progress">В процессе</option>
                                    <option value="completed">Завершено</option>
                                    <option value="cancelled">Отменено</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
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
                                    {groupId ? 'Сохранить' : 'Создать'}
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'participants' && groupId && (
                        <GroupParticipants groupId={groupId} />
                    )}

                    {activeTab === 'participants' && !groupId && (
                        <div className="text-center py-8 text-gray-500">
                            Сначала сохраните группу, чтобы добавить участников
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}