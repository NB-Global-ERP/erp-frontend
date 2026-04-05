import {useCallback, useState} from 'react';
import {Grid, HeaderMenu, type IApi, type IFilterValues} from '@svar-ui/react-grid';
import { CourseForm } from './CourseForm';
import {Pen, Plus, RefreshCw} from 'lucide-react';
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
    const [gridKey, setGridKey] = useState(0);

    const {courses, isLoading} = useCourses();
    const fetchAllData = useERPStore((state) => state.fetchAllData);

    const handleRefresh = async () => {
        await fetchAllData();
        setGridKey(k => k + 1);
    };

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

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Справочник курсов</h2>
                <div className="flex gap-4">
                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}/>
                        Обновить
                    </button>
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
                        key={gridKey}
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