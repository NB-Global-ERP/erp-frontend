import { useMemo } from 'react';
import { useERPStore } from '@/stores/erpStore';

export function useCompanies() {
    const companies = useERPStore((state) => state.companies);
    const employees = useERPStore((state) => state.employees);
    const specifications = useERPStore((state) => state.specifications);
    const isLoading = useERPStore((state) => state.isLoading);

    const companiesWithCompany = useMemo(() => {
        return companies.map(company => ({
            id: company.id,
            code: company.code,
            name: company.name,
            employeesCount: employees.filter(e => e.companyId === company.id).length,
            specificationsCount: specifications.filter(s => s.companyId === company.id).length,
        }));
    }, [companies, employees, specifications]);

    return {
        companies: companiesWithCompany,
        isLoading,
    };
}