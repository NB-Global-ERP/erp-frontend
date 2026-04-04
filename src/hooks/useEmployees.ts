import { useMemo } from 'react';
import { useERPStore } from '@/stores/erpStore';

export function useEmployees() {
    const employees = useERPStore((state) => state.employees);
    const companies = useERPStore((state) => state.companies);
    const isLoading = useERPStore((state) => state.isLoading);

    const employeesWithCompany = useMemo(() => {
        return employees.map(emp => ({
            ...emp,
            fullName: emp.fullName,
            companyName: companies.find(c => c.id === emp.companyId)?.name || '',
        }));
    }, [employees, companies]);

    return {
        employees: employeesWithCompany,
        isLoading,
    };
}