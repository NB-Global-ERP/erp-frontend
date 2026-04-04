import { create } from 'zustand';
import * as api from '@/services/api';
import type {
    Course,
    Employee,
    TrainingGroup,
    Specification,
    Company, Status,
    AnalyticsState
} from '@/types/erp.types';
import type {
    CourseRequest,
    CoursePatchRequest,
    StudentRequest,
    StudentPatchRequest,
    GroupRequest,
    GroupPatchRequest,
    SpecificationRequest,
    SpecificationPatchRequest,
    CompanyRequest,
    CompanyPatchRequest, CourseCompletionStatusPatchRequest, CourseCompletionStatusRequest
} from '@/types/api.types';

interface ERPState {
    courses: Course[];
    employees: Employee[];
    companies: Company[];
    groups: TrainingGroup[];
    specifications: Specification[];
    statuses: Status[];

    analytics: AnalyticsState;

    isLoading: boolean;
    error: string | null;

    fetchAllData: () => Promise<void>;

    fetchCourseAnalytics: () => Promise<void>;
    fetchAllAnalytics: () => Promise<void>;

    addCourse: (data: CourseRequest) => Promise<void>;
    updateCourse: (id: number, data: CoursePatchRequest) => Promise<void>;
    deleteCourse: (id: number) => Promise<void>;

    addEmployee: (data: StudentRequest) => Promise<void>;
    updateEmployee: (id: number, data: StudentPatchRequest) => Promise<void>;
    deleteEmployee: (id: number) => Promise<void>;

    addGroup: (data: GroupRequest) => Promise<void>;
    updateGroup: (id: number, data: GroupPatchRequest) => Promise<void>;
    deleteGroup: (id: number) => Promise<void>;
    addStudentToGroup: (groupId: number, studentId: number) => Promise<void>;

    addSpecification: (data: SpecificationRequest) => Promise<void>;
    updateSpecification: (id: number, data: SpecificationPatchRequest) => Promise<void>;
    deleteSpecification: (id: number) => Promise<void>;

    addCompany: (data: CompanyRequest) => Promise<void>;
    updateCompany: (id: number, data: CompanyPatchRequest) => Promise<void>;
    deleteCompany: (id: number) => Promise<void>;

    addStatus: (data: CourseCompletionStatusRequest) => Promise<void>;
    updateStatus: (id: number, data: CourseCompletionStatusPatchRequest) => Promise<void>;
    deleteStatus: (id: number) => Promise<void>;
}

export const useERPStore = create<ERPState>((set, get) => ({

    courses: [],
    employees: [],
    companies: [],
    groups: [],
    specifications: [],
    statuses: [],

    analytics: {
        courseTotalDuration: 0,
        courseMinDuration: 0,
        courseMaxDuration: 0,
        courseCount: 0,
        courseAvgDuration: 0,
        courseBasicStats: null,
        totalCompanies: 0,
        totalEmployees: 0,
        totalGroups: 0,
        totalSpecifications: 0,
        averageGroupProgress: 0,
        totalRevenue: 0,
    },

    isLoading: false,
    error: null,

    fetchAllData: async () => {
        set({ isLoading: true, error: null });

        try {
            const results = await Promise.allSettled([
                api.getCourses(),
                api.getEmployees(),
                api.getGroups(),
                api.getSpecifications(),
                api.getCompanies(),
                api.getStatuses(),
            ]);

            if (results[0].status === 'fulfilled') {
                set({ courses: results[0].value });
            }
            if (results[1].status === 'fulfilled') {
                set({ employees: results[1].value });
            }
            if (results[2].status === 'fulfilled') {
                set({ groups: results[2].value });
            }
            if (results[3].status === 'fulfilled') {
                set({ specifications: results[3].value });
            }
            if (results[4].status === 'fulfilled') {
                set({ companies: results[4].value });
            }
            if (results[5].status === 'fulfilled') {
                set({ statuses: results[5].value });
            }

            const names = ['courses', 'employees', 'groups', 'specifications', 'companies', 'statuses'];
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`Failed to fetch ${names[index]}:`, result.reason);
                }
            });

            set({ isLoading: false });
        } catch (e) {
            set({
                error: (e as Error).message,
                isLoading: false,
            });
        }
    },

    fetchCourseAnalytics: async () => {
        try {
            const [
                count,
                basicStats
            ] = await Promise.all([
                api.getCoursesCount(),
                api.getCoursesBasicStats(),
            ]);

            set((state) => ({
                analytics: {
                    ...state.analytics,
                    courseCount: count,
                    courseBasicStats: basicStats,
                }
            }));
        } catch (e) {
            set({ error: (e as Error).message });
            throw e;
        }
    },

    fetchAllAnalytics: async () => {
        set({ isLoading: true });

        try {
            const results = await Promise.allSettled([
                api.getCoursesCount(),
                api.getCoursesBasicStats(),
                api.getCompaniesCount(),
                api.getEmployees().then(emps => emps.length),
            ]);

            const { groups } = get();

            const updates: Partial<AnalyticsState> = {};

            if (results[0].status === 'fulfilled') {
                updates.courseCount = results[0].value;
            }
            if (results[1].status === 'fulfilled') {
                updates.courseBasicStats = results[1].value;
            }
            if (results[2].status === 'fulfilled') {
                updates.totalCompanies = results[2].value;
            }
            if (results[3].status === 'fulfilled') {
                updates.totalEmployees = results[3].value;
            }

            updates.totalGroups = groups.length;
            updates.totalSpecifications = get().specifications.length;
            updates.averageGroupProgress = groups.length > 0
                ? Math.round(groups.reduce((sum, g) => sum + g.averageProgress, 0) / groups.length)
                : 0;
            updates.totalRevenue = groups.reduce((sum, g) => sum + g.totalCost, 0);

            const names = ['coursesCount', 'coursesBasicStats', 'companiesCount', 'employeesCount'];
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`Failed to fetch ${names[index]}:`, result.reason);
                }
            });

            set((state) => ({
                analytics: {
                    ...state.analytics,
                    ...updates,
                },
                isLoading: false,
            }));
        } catch (e) {
            set({
                error: (e as Error).message,
                isLoading: false
            });
        }
    },

    addCourse: async (data) => {
        try {
            const { id } = await api.createCourse(data);
            const created = await api.getCourse(id);

            set((state) => ({
                courses: [...state.courses, created],
            }));
        } catch (e) {
            set({ error: (e as Error).message });
            throw e;
        }
    },

    updateCourse: async (id, data) => {
        try {
            const updated = await api.updateCourse(id, data);

            set((state) => ({
                courses: state.courses.map(c =>
                    c.id === id ? updated : c
                ),
            }));
        } catch (e) {
            set({ error: (e as Error).message });
            throw e;
        }
    },

    deleteCourse: async (id) => {
        try {
            await api.deleteCourse(id);

            set((state) => ({
                courses: state.courses.filter(c => c.id !== id),
            }));
        } catch (e) {
            set({ error: (e as Error).message });
            throw e;
        }
    },

    addEmployee: async (data) => {
        try {
            await api.createEmployee(data);
            const employees = await api.getEmployees();

            set({ employees });
        } catch (e) {
            set({ error: (e as Error).message });
            throw e;
        }
    },

    updateEmployee: async (id, data) => {
        try {
            const updated = await api.updateEmployee(id, data);

            set((state) => ({
                employees: state.employees.map(e =>
                    e.id === id ? updated : e
                ),
            }));
        } catch (e) {
            set({ error: (e as Error).message });
            throw e;
        }
    },

    deleteEmployee: async (id) => {
        try {
            await api.deleteEmployee(id);

            set((state) => ({
                employees: state.employees.filter(e => e.id !== id),
            }));
        } catch (e) {
            set({ error: (e as Error).message });
            throw e;
        }
    },

    addGroup: async (data) => {
        try {
            await api.createGroup(data);
            const groups = await api.getGroups();

            set({ groups });
        } catch (e) {
            set({ error: (e as Error).message });
            throw e;
        }
    },

    updateGroup: async (id, data) => {
        try {
            const updated = await api.updateGroup(id, data);

            set((state) => ({
                groups: state.groups.map(g =>
                    g.id === id ? updated : g
                ),
            }));
        } catch (e) {
            set({ error: (e as Error).message });
            throw e;
        }
    },

    deleteGroup: async (id) => {
        try {
            await api.deleteGroup(id);

            set((state) => ({
                groups: state.groups.filter(g => g.id !== id),
            }));
        } catch (e) {
            set({ error: (e as Error).message });
            throw e;
        }
    },

    addStudentToGroup: async (groupId, studentId) => {
        try {
            await api.addStudentToGroup(groupId, studentId);
            const groups = await api.getGroups();
            set({ groups });

            await get().fetchAllAnalytics();
        } catch (e) {
            set({ error: (e as Error).message });
            throw e;
        }
    },

    addSpecification: async (data) => {
        try {
            await api.createSpecification(data);
            const specifications = await api.getSpecifications();

            set({ specifications });
        } catch (e) {
            set({ error: (e as Error).message });
            throw e;
        }
    },

    updateSpecification: async (id, data) => {
        try {
            const updated = await api.updateSpecification(id, data);

            set((state) => ({
                specifications: state.specifications.map(s =>
                    s.id === id ? updated : s
                ),
            }));
        } catch (e) {
            set({ error: (e as Error).message });
            throw e;
        }
    },

    deleteSpecification: async (id) => {
        try {
            await api.deleteSpecification(id);

            set((state) => ({
                specifications: state.specifications.filter(s => s.id !== id),
            }));
        } catch (e) {
            set({ error: (e as Error).message });
            throw e;
        }
    },

    addCompany: async (data) => {
        try {
            await api.createCompany(data);
            const companies = await api.getCompanies();

            set({ companies });
        } catch (e) {
            set({ error: (e as Error).message });
            throw e;
        }
    },

    updateCompany: async (id, data) => {
        try {
            const updated = await api.updateCompany(id, data);

            set((state) => ({
                companies: state.companies.map(c =>
                    c.id === id ? updated : c
                ),
            }));
        } catch (e) {
            set({ error: (e as Error).message });
            throw e;
        }
    },

    deleteCompany: async (id) => {
        try {
            await api.deleteCompany(id);

            set((state) => ({
                companies: state.companies.filter(c => c.id !== id),
            }));
        } catch (e) {
            set({ error: (e as Error).message });
            throw e;
        }
    },

    addStatus: async (data) => {
        try {
            const { id } = await api.createStatus(data);
            const created = await api.getStatus(id);

            set((state) => ({
                statuses: [...state.statuses, created],
            }));
        } catch (e) {
            set({ error: (e as Error).message });
            throw e;
        }
    },

    updateStatus: async (id, data) => {
        try {
            const updated = await api.updateStatus(id, data);

            set((state) => ({
                statuses: state.statuses.map(s =>
                    s.id === id ? updated : s
                ),
            }));
        } catch (e) {
            set({ error: (e as Error).message });
            throw e;
        }
    },

    deleteStatus: async (id) => {
        try {
            await api.deleteStatus(id);

            set((state) => ({
                statuses: state.statuses.filter(s => s.id !== id),
            }));
        } catch (e) {
            set({ error: (e as Error).message });
            throw e;
        }
    },
}));