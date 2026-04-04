import { useMemo } from 'react';
import { useERPStore } from '@/stores/erpStore';

export function useSpecifications() {
    const specifications = useERPStore((state) => state.specifications);
    const companies = useERPStore((state) => state.companies);

    return useMemo(() => {
        return specifications.map(spec => ({
            ...spec,
            companyName: companies.find(c => c.id === spec.companyId)?.name || '',
        }));
    }, [specifications, companies]);
}