import { useState } from 'react';
import {ContextMenu, Grid, HeaderMenu} from '@svar-ui/react-grid';
import { CourseForm } from './CourseForm';
import { Plus } from 'lucide-react';
import {formatCurrency} from "@/utils/formatters.ts";
import ru from "@/utils/ru.ts";
import {Locale} from "@svar-ui/react-core";
import {useCourses} from "@/hooks/useCourses.ts";

export function Courses() {
    const [showForm, setShowForm] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [api, setApi] = useState(null);

    const courses = useCourses();

    const columns = [
        { id: 'name', header: 'Название курса', width: 250 },
        { id: 'description', header: 'Описание', width: 300 },
        { id: 'durationDays', header: 'Длительность, дни', width: 120 },
        {
            id: 'price',
            header: 'Цена за чел.',
            width: 150,
            template: (value: number) => formatCurrency(value)
        },
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

            <Locale words={{ ...ru, ...ru }}>
                <ContextMenu api={api}>
                    <HeaderMenu api={api}>
                        <Grid
                            init={setApi}
                            data={courses}
                            columns={columns}
                            onRowDoubleClick={(row) => {
                                setSelectedCourseId(row.id);
                                setShowForm(true);
                            }}
                        />
                    </HeaderMenu>
                </ContextMenu>
            </Locale>

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