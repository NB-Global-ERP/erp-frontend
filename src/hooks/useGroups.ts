import { useMemo } from 'react';
import { useERPStore } from '@/stores/erpStore';

export function useGroups() {
    const groups = useERPStore((state) => state.groups);
    const courses = useERPStore((state) => state.courses);
    const isLoading = useERPStore((state) => state.isLoading);

    const groupsWithCourseNames = useMemo(() =>
            groups.map(group => ({
                ...group,
                courseName: courses.find(c => c.id === group.courseId)?.name || '—',
            })),
        [groups, courses]
    );

    const totalGroups = groups.length;
    const totalBudget = groups.reduce((sum, g) => sum + g.totalCost, 0);
    const averageProgress = groups.length > 0
        ? Math.round(groups.reduce((sum, g) => sum + g.averageProgress, 0) / groups.length)
        : 0;

    return {
        groups: groupsWithCourseNames,
        totalGroups,
        totalBudget,
        averageProgress,
        isLoading,
    };
}