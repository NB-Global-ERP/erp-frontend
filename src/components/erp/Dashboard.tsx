import { useERPStore } from '@/stores/erpStore';
import { Users, BookOpen, FileText, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters.ts';
import { useAnalytics } from '@/hooks/useAnalytics';

export function Dashboard() {
    const groups = useERPStore((state) => state.groups);
    const courses = useERPStore((state) => state.courses);
    const employees = useERPStore((state) => state.employees);
    const specifications = useERPStore((state) => state.specifications);
    const isLoading = useERPStore((state) => state.isLoading);

    const { totalRevenue, averageGroupProgress } = useAnalytics();

    const totalGroups = groups.length;
    const totalCourses = courses.length;
    const totalEmployees = employees.length;
    const totalSpecifications = specifications.length;

    const totalBudget = totalRevenue;

    const averageProgress = averageGroupProgress;

    const stats = [
        { label: 'Группы', value: totalGroups, icon: Users, color: 'bg-blue-100 text-blue-600' },
        { label: 'Курсы', value: totalCourses, icon: BookOpen, color: 'bg-green-100 text-green-600' },
        { label: 'Сотрудники', value: totalEmployees, icon: Users, color: 'bg-purple-100 text-purple-600' },
        { label: 'Спецификации', value: totalSpecifications, icon: FileText, color: 'bg-orange-100 text-orange-600' },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Загрузка аналитики...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Аналитика обучения
                    </h2>
                    <p className="text-sm text-gray-500">
                        Сводка по системе обучения
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-sm text-gray-500">Общий бюджет</p>
                    <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(totalBudget)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                        <div className={`p-2 rounded-md ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>

                        <div>
                            <p className="text-xs text-gray-500">
                                {stat.label}
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                                {stat.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-white border border-gray-200 rounded-lg">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Последние группы
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                        {groups.length === 0 ? (
                            <div className="px-5 py-8 text-center text-gray-500">
                                Нет созданных групп
                            </div>
                        ) : (
                            groups.slice(0, 6).map((group) => (
                                <div
                                    key={group.id}
                                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {group.courseId}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {group.startDate.toLocaleDateString('ru-RU')} —{' '}
                                            {group.endDate.toLocaleDateString('ru-RU')}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-5 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3 h-3 text-gray-400" />
                                            <span className="text-gray-600">
                                                {group.participantCount}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3 text-gray-400" />
                                            <span className="font-medium text-gray-900">
                                                {Math.round(group.averageProgress)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Общая эффективность
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Средний прогресс по всем группам
                                </p>
                                <p className="text-3xl font-semibold text-gray-900 mt-1">
                                    {averageProgress}%
                                </p>
                            </div>

                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${averageProgress}%` }}
                                />
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Всего групп</span>
                                <span className="text-sm font-medium text-gray-900">{totalGroups}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-gray-500">Активных групп</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {groups.filter(g => g.averageProgress > 0 && g.averageProgress < 100).length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-gray-500">Завершенных групп</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {groups.filter(g => g.averageProgress === 100).length}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between text-xs text-gray-400">
                        <span>Обновляется автоматически</span>
                        <span>ERP v1.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
}