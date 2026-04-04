import { useState } from 'react';
import {ContextMenu, Grid, HeaderMenu, type IApi, type IFilterValues} from '@svar-ui/react-grid';
import { CourseForm } from './CourseForm';
import { Plus } from 'lucide-react';
import {formatCurrency} from "@/utils/formatters.ts";
import ru from "@/utils/ru.ts";
import {Locale} from "@svar-ui/react-core";
import {useCourses} from "@/hooks/useCourses.ts";

export function Courses() {
    const [showForm, setShowForm] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [api, setApi] = useState<IApi>();
    const [filterValues, setFilterValues] = useState<IFilterValues>({});

    const {courses, isLoading} = useCourses();

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

    if (isLoading && courses.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Загрузка курсов...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Справочник курсов</h2>
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
                            filterValues={filterValues}
                            onFilterChange={setFilterValues}
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