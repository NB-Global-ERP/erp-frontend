import { create } from 'zustand';
import * as api from '@/services/api';
import type {
    Course,
    Employee,
    TrainingGroup,
    Specification,
    Company
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
    CompanyPatchRequest
} from '@/types/api.types';

interface ERPState {
    courses: Course[];
    employees: Employee[];
    companies: Company[];
    groups: TrainingGroup[];
    specifications: Specification[];

    isLoading: boolean;
    error: string | null;

    fetchAllData: () => Promise<void>;

    addCourse: (data: CourseRequest) => Promise<void>;
    updateCourse: (id: number, data: CoursePatchRequest) => Promise<void>;
    deleteCourse: (id: number) => Promise<void>;

    addEmployee: (data: StudentRequest) => Promise<void>;
    updateEmployee: (id: number, data: StudentPatchRequest) => Promise<void>;
    deleteEmployee: (id: number) => Promise<void>;

    addGroup: (data: GroupRequest) => Promise<void>;
    updateGroup: (id: number, data: GroupPatchRequest) => Promise<void>;
    deleteGroup: (id: number) => Promise<void>;

    addSpecification: (data: SpecificationRequest) => Promise<void>;
    updateSpecification: (id: number, data: SpecificationPatchRequest) => Promise<void>;
    deleteSpecification: (id: number) => Promise<void>;

    addCompany: (data: CompanyRequest) => Promise<void>;
    updateCompany: (id: number, data: CompanyPatchRequest) => Promise<void>;
    deleteCompany: (id: number) => Promise<void>;
}

export const useERPStore = create<ERPState>((set) => ({

    courses: [],
    employees: [],
    companies: [],
    groups: [],
    specifications: [],

    isLoading: false,
    error: null,

    fetchAllData: async () => {
        set({ isLoading: true, error: null });

        try {
            const [courses, employees, groups, specifications, companies] =
                await Promise.all([
                    api.getCourses(),
                    api.getEmployees(),
                    api.getGroups(),
                    api.getSpecifications(),
                    api.getCompanies(),
                ]);

            set({
                courses,
                employees,
                groups,
                specifications,
                companies,
                isLoading: false,
            });

        } catch (e) {
            set({
                error: (e as Error).message,
                isLoading: false,
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

}));