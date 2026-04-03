import { useState } from 'react';
import { Grid } from '@svar-ui/react-grid';
import { useERPStore } from '@/stores/erpStore';
import { CourseForm } from './CourseForm';
import { Plus } from 'lucide-react';
import {formatCurrency} from "@/utils/formatters.ts";

export function Courses() {
    const [showForm, setShowForm] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

    const courses = useERPStore((state) => state.courses);

    const columns = [
        { id: 'code', header: 'Код', width: 100 },
        { id: 'name', header: 'Название курса', width: 250 },
        { id: 'description', header: 'Описание', width: 300 },
        { id: 'durationDays', header: 'Длительность, дни', width: 120 },
        { id: 'pricePerPerson', header: 'Цена за чел., ₽', width: 150,
            format: (value: number) => formatCurrency(value) },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Справочник курсов</h2>
                <button
                    onClick={() => {
                        setSelectedCourseId(null);
                        setShowForm(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                    <Plus className="w-4 h-4" />
                    Добавить курс
                </button>
            </div>

            <Grid
                data={courses}
                columns={columns}
                onRowDoubleClick={(row) => {
                    setSelectedCourseId(row.id);
                    setShowForm(true);
                }}
            />

            {showForm && (
                <CourseForm
                    courseId={selectedCourseId}
                    onClose={() => setShowForm(false)}
                    onSave={() => setShowForm(false)}
                />
            )}
        </div>
    );
}