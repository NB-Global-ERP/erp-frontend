import { useMemo } from 'react';
import { useERPStore } from '@/stores/erpStore';

export function useGroups() {
    const groupsDTO = useERPStore((state) => state.groupsDTO);
    const isLoading = useERPStore((state) => state.isLoading);

    return useMemo(() => ({
        groups: groupsDTO,
        totalGroups: groupsDTO.length,
        totalBudget: groupsDTO.reduce((sum, g) => sum + g.groupPrice, 0),
        averageProgress: groupsDTO.length > 0
            ? Math.round(groupsDTO.reduce((sum, g) => sum + g.averageProgress, 0) / groupsDTO.length)
            : 0,
        isLoading,
    }), [groupsDTO, isLoading]);
}