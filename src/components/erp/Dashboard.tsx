import { useERPStore } from '@/stores/erpStore';
import { Users, BookOpen, FileText, TrendingUp } from 'lucide-react';
import {formatCurrency} from "@/utils/formatters.ts";

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
    const averageProgress = groups.length > 0
        ? Math.round(groups.reduce((sum, g) => sum + g.averageProgress, 0) / groups.length)
        : 0;

    const stats = [
        { label: 'Учебных групп', value: totalGroups, icon: Users },
        { label: 'Курсов', value: totalCourses, icon: BookOpen },
        { label: 'Сотрудников', value: totalEmployees, icon: Users },
        { label: 'Спецификаций', value: totalSpecifications, icon: FileText },
        { label: 'Бюджет обучения', value: formatCurrency(totalBudget), icon: TrendingUp },
        { label: 'Средний прогресс', value: `${averageProgress}%`, icon: TrendingUp },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Аналитика обучения</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-full`}>
                                <stat.icon className="w-7 h-7 text-primary" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Последние группы обучения</h3>
                <div className="space-y-2">
                    {groups.slice(0, 5).map((group) => (
                        <div key={group.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                            <div>
                                <p className="font-medium text-gray-800">{group.courseId}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(group.startDate).toLocaleDateString('ru-RU')} - {new Date(group.endDate).toLocaleDateString('ru-RU')}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">{group.participantCount} уч.</span>
                                <span className="text-sm font-medium text-blue-600">{group.averageProgress}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}