import { REGEX } from './constants';

export function isEmployeeDuplicate(
    fullName: string,
    companyId: string,
    existingEmployees: Array<{ fullName: string; companyId: string }>
): boolean {
    return existingEmployees.some(
        emp => emp.fullName.toLowerCase() === fullName.toLowerCase() && emp.companyId === companyId
    );
}

export function isValidEmail(email: string): boolean {
    return REGEX.EMAIL.test(email);
}

export function hasDateConflict(
    startDate: Date,
    endDate: Date,
    existingGroups: Array<{ startDate: Date; endDate: Date; courseId: string }>,
    courseId: string,
    excludeGroupId?: string
): boolean {
    return existingGroups.some(group => {
        if (excludeGroupId && (group as any).id === excludeGroupId) return false;
        if (group.courseId !== courseId) return false;

        const groupStart = new Date(group.startDate);
        const groupEnd = new Date(group.endDate);

        return (startDate <= groupEnd && endDate >= groupStart);
    });
}

export function isValidDateRange(startDate: Date, endDate: Date): boolean {
    return startDate <= endDate;
}

export function isValidProgress(progress: number): boolean {
    return progress >= 0 && progress <= 100;
}