import {useERPStore} from '@/stores/erpStore';

export function useCourses() {
    const courses = useERPStore((state) => state.courses);
    const groups = useERPStore((state) => state.groups);

    return courses.map(course => ({
        ...course,
        groupsCount: groups.filter(g => g.courseId === course.id).length,
    }));
}