import { useState } from 'react';
import {ContextMenu, Grid, HeaderMenu} from '@svar-ui/react-grid';
import { useERPStore } from '@/stores/erpStore';
import { SpecificationForm } from './SpecificationForm';
import { formatCurrency } from '@/services/calculations';
import { Plus } from 'lucide-react';
import ru from "@/utils/ru.ts";
import {Locale} from "@svar-ui/react-core";

export function Specifications() {
    const [showForm, setShowForm] = useState(false);
    const [selectedSpecId, setSelectedSpecId] = useState<string | null>(null);
    const [api, setApi] = useState(null);

    const specifications = useERPStore((state) => state.specifications);
    const companies = useERPStore((state) => state.companies);
    const getSpecificationWithGroups = useERPStore((state) => state.getSpecificationWithGroups);

    const specsWithData = specifications.map(spec => {
        const full = getSpecificationWithGroups(spec.id);
        return {
            id: spec.id,
            number: spec.number,
            date: spec.date.toLocaleDateString('ru-RU'),
            company: companies.find(c => c.id === spec.companyId)?.name || '',
            totalAmount: full?.totalAmount || 0,
            totalWithVat: full?.totalWithVat || 0,
        };
    });

    const columns = [
        { id: 'number', header: 'Номер', width: 150 },
        { id: 'date', header: 'Дата', width: 120 },
        { id: 'company', header: 'Компания', width: 200 },
        { id: 'totalAmount', header: 'Сумма без НДС, ₽', width: 150,
            format: (value: number) => formatCurrency(value) },
        { id: 'totalWithVat', header: 'Итого с НДС, ₽', width: 150,
            format: (value: number) => formatCurrency(value) },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Спецификации</h2>
                <button
                    onClick={() => {
                        setSelectedSpecId(null);
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
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
                            onRowDoubleClick={(row) => {
                                setSelectedSpecId(row.id);
                                setShowForm(true);
                            }}
                        />
                    </HeaderMenu>
                </ContextMenu>
            </Locale>

            {showForm && (
                <SpecificationForm
                    specId={selectedSpecId}
                    onClose={() => setShowForm(false)}
                    onSave={() => setShowForm(false)}
                />
            )}
        </div>
    );
}