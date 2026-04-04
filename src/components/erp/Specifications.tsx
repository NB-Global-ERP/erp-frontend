import { useState, useMemo } from 'react';
import {ContextMenu, Grid, HeaderMenu, Toolbar} from '@svar-ui/react-grid';
import { useERPStore } from '@/stores/erpStore';
import { SpecificationForm } from './SpecificationForm';
import { formatCurrency } from '@/utils/formatters.ts';
import { Plus } from 'lucide-react';
import ru from "@/utils/ru.ts";
import { Locale } from "@svar-ui/react-core";

export function Specifications() {
    const [showForm, setShowForm] = useState(false);
    const [selectedSpecId, setSelectedSpecId] = useState<number | null>(null);
    const [api, setApi] = useState(null);

    const specifications = useERPStore((state) => state.specifications);
    const companies = useERPStore((state) => state.companies);
    const groups = useERPStore((state) => state.groups);

    const specsWithData = useMemo(() => {
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

    const columns = [
        {
            id: 'number',
            header: 'Номер',
            width: 100,
            template: (value: number) => value || '—'
        },
        {
            id: 'date',
            header: 'Дата',
            width: 120,
            template: (value: string) => value || '—'
        },
        {
            id: 'companyName',
            header: 'Компания',
            width: 200,
            template: (value: string) => value || '—'
        },
        {
            id: 'groupsCount',
            header: 'Групп',
            width: 80,
            template: (value: number) => value || 0
        },
        {
            id: 'participantsCount',
            header: 'Участников',
            width: 100,
            template: (value: number) => value || 0
        },
        {
            id: 'totalAmount',
            header: 'Сумма без НДС',
            width: 150,
            template: (value: number) => formatCurrency(value || 0)
        },
        {
            id: 'totalWithVat',
            header: 'Итого с НДС',
            width: 150,
            template: (value: number) => formatCurrency(value || 0)
        },
    ];

    const toolbarItems = [
        {
            id: 'add-spec',
            comp: 'button',
            icon: 'wxi-plus',
            text: 'Создать спецификацию',
            action: () => {
                setSelectedSpecId(null);
                setShowForm(true);
            },
        },
        { comp: 'spacer' },
        {
            id: 'refresh',
            comp: 'button',
            icon: 'wxi-refresh',
            text: 'Обновить',
            action: async () => {
                const fetchAllData = useERPStore.getState().fetchAllData;
                await fetchAllData();
            },
        },
    ];

    const handleRowDoubleClick = (row: any) => {
        setSelectedSpecId(row.id);
        setShowForm(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Спецификации</h2>
                <button
                    onClick={() => {
                        setSelectedSpecId(null);
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Создать спецификацию
                </button>
            </div>

            <Locale words={{ ...ru, ...ru }}>
                <ContextMenu api={api}>
                    <HeaderMenu api={api}>
                        <Grid
                            init={setApi}
                            data={specsWithData}
                            columns={columns}
                            toolbar={<Toolbar items={toolbarItems} />}
                            onRowDoubleClick={handleRowDoubleClick}
                        />
                    </HeaderMenu>
                </ContextMenu>
            </Locale>

            {showForm && (
                <SpecificationForm
                    specId={selectedSpecId}
                    onClose={() => setShowForm(false)}
                    onSave={() => {
                        setShowForm(false);
                        const fetchAllData = useERPStore.getState().fetchAllData;
                        fetchAllData();
                    }}
                />
            )}
        </div>
    );
}