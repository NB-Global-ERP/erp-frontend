import { useMemo } from 'react';
import { useERPStore } from '@/stores/erpStore';

export function useAnalytics() {
    const analytics = useERPStore((state) => state.analytics);
    const isLoading = useERPStore((state) => state.isLoading);
    const fetchAllAnalytics = useERPStore((state) => state.fetchAllAnalytics);
    const fetchCourseAnalytics = useERPStore((state) => state.fetchCourseAnalytics);

    return useMemo(() => ({
        totalDuration: analytics.courseTotalDuration,
        minDuration: analytics.courseMinDuration,
        maxDuration: analytics.courseMaxDuration,
        courseCount: analytics.courseCount,
        avgDuration: analytics.courseAvgDuration,
        basicStats: analytics.courseBasicStats,

        totalCompanies: analytics.totalCompanies,
        totalEmployees: analytics.totalEmployees,
        totalGroups: analytics.totalGroups,
        totalSpecifications: analytics.totalSpecifications,
        averageGroupProgress: analytics.averageGroupProgress,
        totalRevenue: analytics.totalRevenue,

        isLoading,

        fetchAllAnalytics,
        fetchCourseAnalytics,
    }), [analytics, isLoading, fetchAllAnalytics, fetchCourseAnalytics]);
}