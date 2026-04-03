import {useMemo} from 'react';
import {useERPStore} from '@/stores/erpStore';

export function useSpecifications() {
    const specifications = useERPStore((state) => state.specifications);
    const companies = useERPStore((state) => state.companies);
    const getSpecificationWithGroups = useERPStore((state) => state.getSpecificationWithGroups);

    return useMemo(() => {
        return specifications.map(spec => {
            const full = getSpecificationWithGroups(spec.id);
            return {
                ...spec,
                companyName: companies.find(c => c.id === spec.companyId)?.name || '',
                totalAmount: full?.totalAmount || 0,
                totalWithVat: full?.totalWithVat || 0,
            };
        });
    }, [specifications, companies, getSpecificationWithGroups]);
}