import { useMemo } from 'react';
import { useERPStore } from '@/stores/erpStore';

export function useAnalytics() {
    const analytics = useERPStore((state) => state.analytics);
    const isLoading = useERPStore((state) => state.isLoading);

    return useMemo(() => ({
        basicStats: analytics.courseBasicStats,

        totalCourses: analytics.courseCount,
        totalCompanies: analytics.totalCompanies,
        totalEmployees: analytics.totalEmployees,
        totalGroups: analytics.totalGroups,
        totalSpecifications: analytics.totalSpecifications,
        averageGroupProgress: analytics.averageGroupProgress,
        totalRevenue: analytics.totalRevenue,

        isLoading,
    }), [analytics, isLoading]);
}