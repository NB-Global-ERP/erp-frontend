import {useERPStore} from '@/stores/erpStore';

export function useEmployees() {
    const employees = useERPStore((state) => state.employees);
    const participants = useERPStore((state) => state.participants);
    const companies = useERPStore((state) => state.companies);

    return employees.map(emp => ({
        ...emp,
        companyName: companies.find(c => c.id === emp.companyId)?.name || '',
        groupsCount: participants.filter(p => p.employeeId === emp.id).length,
    }));
}