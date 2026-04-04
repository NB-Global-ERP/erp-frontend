import {useCallback, useState} from 'react';
import {Grid, HeaderMenu, type IApi, type IFilterValues} from '@svar-ui/react-grid';
import { CourseForm } from './CourseForm';
import {Pen, Plus} from 'lucide-react';
import {formatCurrency} from "@/utils/formatters.ts";
import ru from "@/utils/ru.ts";
import {Locale} from "@svar-ui/react-core";
import {useCourses} from "@/hooks/useCourses.ts";
import type {Course} from "@/types/erp.types.ts";
import {useERPStore} from "@/stores/erpStore.ts";

export function Courses() {
    const [showForm, setShowForm] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
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

    const init = useCallback((gridApi: IApi) => {
        setApi(gridApi);
        gridApi.on('select-row', ({ id }: { id: string | number  }) => {
            const row = gridApi.getRow(id) as Course;
            if (row) {
                setSelectedCourse(row);
            }
        });
    }, []);

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
                <div className="flex gap-4">
                    {!!selectedCourse && (
                        <button
                            onClick={() => {
                                setShowForm(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors"
                        >
                            <Pen className="w-4 h-4"/>
                            Редактировать курс
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setSelectedCourse(null);
                            setShowForm(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        <Plus className="w-4 h-4"/>
                        Добавить курс
                    </button>
                </div>
            </div>

            <Locale words={{...ru, ...ru}}>
                <HeaderMenu api={api}>
                    <Grid
                        init={init}
                        data={courses}
                        columns={columns}
                        filterValues={filterValues}
                        onFilterChange={setFilterValues}
                    />
                </HeaderMenu>
            </Locale>

            {showForm && (
                <CourseForm
                    course={selectedCourse}
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