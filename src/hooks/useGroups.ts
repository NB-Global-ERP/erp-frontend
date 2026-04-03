import { useMemo } from 'react';
import { useERPStore } from '@/stores/erpStore';

export function useGroups() {
    const groups = useERPStore((state) => state.getGroupsWithCalculations());
    const courses = useERPStore((state) => state.courses);

    const groupsWithCourseNames = useMemo(() => {
        return groups.map(group => ({
            ...group,
            courseName: courses.find(c => c.id === group.courseId)?.name || 'Неизвестно',
        }));
    }, [groups, courses]);

    return {
        groups: groupsWithCourseNames,
        totalGroups: groups.length,
        totalBudget: groups.reduce((sum, g) => sum + g.totalCost, 0),
        averageProgress: groups.length > 0
            ? Math.round(groups.reduce((sum, g) => sum + g.averageProgress, 0) / groups.length)
            : 0,
    };
}