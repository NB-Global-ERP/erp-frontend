import { useMemo } from 'react';
import { useERPStore } from '@/stores/erpStore';

export function useGroups() {
    const groups = useERPStore((state) => state.groups);
    const isLoading = useERPStore((state) => state.isLoading);

    return useMemo(() => ({
        groups,
        totalGroups: groups.length,
        totalBudget: groups.reduce((sum, g) => sum + g.totalCost, 0),
        averageProgress: groups.length > 0
            ? Math.round(groups.reduce((sum, g) => sum + g.averageProgress, 0) / groups.length)
            : 0,
        isLoading,
    }), [groups, isLoading]);
}