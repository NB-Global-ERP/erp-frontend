import { useERPStore } from '@/stores/erpStore';
import { Users, BookOpen, FileText, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters.ts';

export function Dashboard() {
    const groups = useERPStore((state) => state.getGroupsWithCalculations());
    const courses = useERPStore((state) => state.courses);
    const employees = useERPStore((state) => state.employees);
    const specifications = useERPStore((state) => state.specifications);

    const totalGroups = groups.length;
    const totalCourses = courses.length;
    const totalEmployees = employees.length;
    const totalSpecifications = specifications.length;

    const totalBudget = groups.reduce((sum, g) => sum + g.totalCost, 0);

    const averageProgress = groups.length
        ? Math.round(groups.reduce((sum, g) => sum + g.averageProgress, 0) / groups.length)
        : 0;

    const stats = [
        { label: 'Группы', value: totalGroups, icon: Users },
        { label: 'Курсы', value: totalCourses, icon: BookOpen },
        { label: 'Сотрудники', value: totalEmployees, icon: Users },
        { label: 'Спецификации', value: totalSpecifications, icon: FileText },
    ];

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
                    <p className="text-sm text-gray-500">Бюджет</p>
                    <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(totalBudget)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg"
                    >
                        <div className="p-2 bg-gray-100 rounded-md">
                            <stat.icon className="w-5 h-5 text-gray-700" />
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
                        <h3 className="text-sm font-semibold text-gray-900">
                            Последние группы
                        </h3>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {groups.slice(0, 6).map((group) => (
                            <div
                                key={group.id}
                                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {group.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(group.startDate).toLocaleDateString('ru-RU')} —{' '}
                                        {new Date(group.endDate).toLocaleDateString('ru-RU')}
                                    </p>
                                </div>

                                <div className="flex items-center gap-5 text-sm">
                                    <span className="text-gray-600">
                                        {group.participantCount}
                                    </span>

                                    <span className="font-medium text-gray-900">
                                        {group.averageProgress}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">
                            Общая эффективность
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Средний прогресс
                                </p>
                                <p className="text-3xl font-semibold text-gray-900 mt-1">
                                    {averageProgress}%
                                </p>
                            </div>

                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all"
                                    style={{ width: `${averageProgress}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                        Обновляется автоматически
                    </div>
                </div>
            </div>
        </div>
    );
}