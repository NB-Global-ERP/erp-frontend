import { useMemo } from 'react';
import { useERPStore } from '@/stores/erpStore';

export function useCourses() {
    const courses = useERPStore((state) => state.courses);
    const groups = useERPStore((state) => state.groups);

    return useMemo(() => {
        return courses.map(course => ({
            ...course,
            groupsCount: groups.filter(g => g.courseId === course.id).length,
            totalParticipants: groups
                .filter(g => g.courseId === course.id)
                .reduce((sum, g) => sum + g.participantCount, 0),
        }));
    }, [courses, groups]);
}