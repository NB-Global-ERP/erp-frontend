import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useERPStore } from '@/stores/erpStore';
import { X } from 'lucide-react';

const courseSchema = z.object({
    code: z.string().min(1, 'Введите код'),
    name: z.string().min(1, 'Введите название'),
    description: z.string().optional(),
    durationDays: z.number().min(1, 'Длительность должна быть больше 0'),
    pricePerPerson: z.number().min(0, 'Цена не может быть отрицательной'),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
    courseId?: string | null;
    onClose: () => void;
    onSave: () => void;
}

export function CourseForm({ courseId, onClose, onSave }: CourseFormProps) {
    const courses = useERPStore((state) => state.courses);
    const addCourse = useERPStore((state) => state.addCourse);
    const updateCourse = useERPStore((state) => state.updateCourse);

    const existingCourse = courseId ? courses.find(c => c.id === courseId) : null;

    const { register, handleSubmit, formState: { errors } } = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema),
        defaultValues: existingCourse ? {
            code: existingCourse.code,
            name: existingCourse.name,
            description: existingCourse.description || '',
            durationDays: existingCourse.durationDays,
            pricePerPerson: existingCourse.pricePerPerson,
        } : {
            code: '',
            name: '',
            description: '',
            durationDays: 1,
            pricePerPerson: 0,
        },
    });

    const onSubmit = (data: CourseFormData) => {
        if (courseId) {
            updateCourse(courseId, data);
        } else {
            addCourse({
                id: Date.now().toString(),
                ...data,
                description: data.description || '',
            });
        }
        onSave();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {courseId ? 'Редактирование курса' : 'Новый курс'}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Код курса *
                        </label>
                        <input
                            {...register('code')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Название курса *
                        </label>
                        <input
                            {...register('name')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Описание
                        </label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Длительность (дни) *
                            </label>
                            <input
                                type="number"
                                {...register('durationDays', { valueAsNumber: true })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            {errors.durationDays && <p className="mt-1 text-sm text-red-600">{errors.durationDays.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Цена за чел., ₽ *
                            </label>
                            <input
                                type="number"
                                {...register('pricePerPerson', { valueAsNumber: true })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            {errors.pricePerPerson && <p className="mt-1 text-sm text-red-600">{errors.pricePerPerson.message}</p>}
                        </div>
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
                            {courseId ? 'Сохранить' : 'Создать'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}