import { useMemo } from 'react';
import { useERPStore } from '@/stores/erpStore';

export function useSpecifications() {
    const specifications = useERPStore((state) => state.specifications);
    const companies = useERPStore((state) => state.companies);
    const isLoading = useERPStore((state) => state.isLoading);
    const groups = useERPStore((state) => state.groups);

    const specificationsWithCompany = useMemo(() => {
        return specifications.map(spec => {
            const linkedGroups = groups.filter(g => g.specificationId === spec.id);

            const totalAmount = linkedGroups.reduce((sum, g) => sum + (g.totalCost || 0), 0);
            const vatAmount = totalAmount * 0.22;
            const totalWithVat = totalAmount + vatAmount;

            const company = companies.find(c => c.id === spec.companyId);

            return {
                id: spec.id,
                number: spec.number,
                date: spec.date.toLocaleDateString('ru-RU'),
                companyName: company?.name || 'Неизвестная компания',
                companyCode: company?.code || '',
                groupsCount: linkedGroups.length,
                participantsCount: linkedGroups.reduce((sum, g) => sum + (g.participantCount || 0), 0),
                totalAmount,
                vatAmount,
                totalWithVat,
            };
        });
    }, [specifications, companies, groups]);

    return {
        specifications: specificationsWithCompany,
        isLoading,
    };
}