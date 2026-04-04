import { useMemo } from 'react';
import { useERPStore } from '@/stores/erpStore';

export function useCompanies() {
    const companies = useERPStore((state) => state.companies);
    const employees = useERPStore((state) => state.employees);
    const specifications = useERPStore((state) => state.specifications);

    return useMemo(() => {
        return companies.map(company => ({
            ...company,
            employeesCount: employees.filter(e => e.companyId === company.id).length,
            specificationsCount: specifications.filter(s => s.companyId === company.id).length,
        }));
    }, [companies, employees, specifications]);
}