import { Users, BookOpen, FileText, TrendingUp, Building2 } from 'lucide-react';
import {formatCurrency, formatPercent} from '@/utils/formatters.ts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useERPStore } from "@/stores/erpStore.ts";

export function Dashboard() {
    const groups = useERPStore((state) => state.groups);

    const {
        basicStats,
        totalCourses,
        totalCompanies,
        totalEmployees,
        totalGroups,
        totalSpecifications,
        averageGroupProgress,
        totalRevenue,
        isLoading
    } = useAnalytics();

    const totalBudget = totalRevenue;
    const averageProgress = averageGroupProgress;

    const stats = [
        { label: 'Группы', value: totalGroups, icon: Users, color: 'bg-primary-50 text-primary-600' },
        { label: 'Курсы', value: totalCourses, icon: BookOpen, color: 'bg-primary-50 text-primary-600' },
        { label: 'Сотрудники', value: totalEmployees, icon: Users, color: 'bg-primary-50 text-primary-600' },
        { label: 'Спецификации', value: totalSpecifications, icon: FileText, color: 'bg-primary-50 text-primary-600' },
        { label: 'Компании', value: totalCompanies, icon: Building2, color: 'bg-primary-50 text-primary-600' },
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

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg transition-shadow"
                    >
                        <div className={`p-2 rounded-md ${stat.color}`}>
                            <stat.icon className="w-5 h-5"/>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                            <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>


            <div className="grid grid-cols-3 gap-6">

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Статистика курсов
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Общая длительность всех курсов</span>
                            <span className="font-semibold text-gray-900">{basicStats?.totalDuration || 0} дней</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Средняя длительность курса</span>
                            <span className="font-semibold text-gray-900">{basicStats?.avgDuration || 0} дней</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Самый короткий курс</span>
                            <span className="font-semibold text-gray-900">{basicStats?.minDuration || 0} дней</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-600">Самый длинный курс</span>
                            <span className="font-semibold text-gray-900">{basicStats?.maxDuration || 0} дней</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg">
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
                                            {new Date(group.startDate).toLocaleDateString('ru-RU')} —{' '}
                                            {new Date(group.endDate).toLocaleDateString('ru-RU')}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-5 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3 h-3 text-gray-400"/>
                                            <span className="text-gray-600">
                                                {group.participantCount}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3 text-gray-400"/>
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
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Общая эффективность
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    Средний прогресс по всем группам
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-semibold text-gray-900">
                                    {formatPercent(averageProgress)}
                                </p>
                            </div>
                        </div>

                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                                className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                                style={{width: formatPercent(averageProgress)}}
                            />
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