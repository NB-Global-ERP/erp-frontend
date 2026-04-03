import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
    Course, Employee, TrainingGroup, GroupParticipant,
    Specification, Company, TrainingGroupFull
} from '@/types/erp.types';
import { getGroupCalculatedFields, calculateSpecificationTotals } from '@/services/calculations';

interface ERPState {
    courses: Course[];
    employees: Employee[];
    companies: Company[];
    groups: TrainingGroup[];
    participants: GroupParticipant[];
    specifications: Specification[];

    _cachedGroups: TrainingGroupFull[] | null;
    _lastUpdateTimestamp: number;

    addCourse: (course: Course) => void;
    updateCourse: (id: string, updates: Partial<Course>) => void;
    deleteCourse: (id: string) => void;

    addEmployee: (employee: Employee) => void;
    updateEmployee: (id: string, updates: Partial<Employee>) => void;
    deleteEmployee: (id: string) => void;

    addGroup: (group: TrainingGroup) => void;
    updateGroup: (id: string, updates: Partial<TrainingGroup>) => void;
    deleteGroup: (id: string) => void;

    addParticipant: (participant: GroupParticipant) => void;
    updateParticipant: (id: string, updates: Partial<GroupParticipant>) => void;
    removeParticipant: (id: string) => void;

    addSpecification: (spec: Specification) => void;
    updateSpecification: (id: string, updates: Partial<Specification>) => void;
    deleteSpecification: (id: string) => void;

    getGroupsWithCalculations: () => TrainingGroupFull[];
    getGroupById: (id: string) => TrainingGroupFull | undefined;
    getSpecificationWithGroups: (id: string) => any;

    invalidateCache: () => void;
}

export const useERPStore = create<ERPState>()(
    persist(
        (set, get) => ({
            courses: [],
            employees: [],
            companies: [
                { id: '1', code: 'ROM', name: 'ООО "Ромашка"' },
                { id: '2', code: 'LUT', name: 'ООО "Лютик"' },
            ],
            groups: [],
            participants: [],
            specifications: [],
            _cachedGroups: null,
            _lastUpdateTimestamp: 0,

            invalidateCache: () => {
                set({ _cachedGroups: null, _lastUpdateTimestamp: Date.now() });
            },

            getGroupsWithCalculations: () => {
                const state = get();
                const { groups, participants, _cachedGroups, _lastUpdateTimestamp } = state;

                const currentTimestamp = Date.now();
                if (_cachedGroups && (currentTimestamp - _lastUpdateTimestamp) < 100) {
                    return _cachedGroups;
                }

                const result = groups.map(group => ({
                    ...group,
                    ...getGroupCalculatedFields(group, participants.filter(p => p.groupId === group.id))
                }));

                set({ _cachedGroups: result, _lastUpdateTimestamp: currentTimestamp });
                return result;
            },

            getGroupById: (id: string) => {
                const state = get();
                const { groups, participants } = state;
                const group = groups.find(g => g.id === id);
                if (!group) return undefined;
                return {
                    ...group,
                    ...getGroupCalculatedFields(group, participants.filter(p => p.groupId === id))
                };
            },

            getSpecificationWithGroups: (id: string) => {
                const state = get();
                const { specifications, groups, participants } = state;
                const spec = specifications.find(s => s.id === id);
                if (!spec) return undefined;

                const specGroups = groups.filter(g => spec.groupIds.includes(g.id));
                const groupsWithCalc = specGroups.map(group => ({
                    ...group,
                    ...getGroupCalculatedFields(group, participants.filter(p => p.groupId === group.id))
                }));

                const totals = calculateSpecificationTotals(specGroups);
                return { ...spec, groups: groupsWithCalc, ...totals };
            },

            addCourse: (course) => {
                set((state) => ({ courses: [...state.courses, course] }));
                get().invalidateCache();
            },
            updateCourse: (id, updates) => {
                set((state) => ({
                    courses: state.courses.map(c => c.id === id ? { ...c, ...updates } : c)
                }));
                get().invalidateCache();
            },
            deleteCourse: (id) => {
                set((state) => ({ courses: state.courses.filter(c => c.id !== id) }));
                get().invalidateCache();
            },

            addEmployee: (employee) => {
                set((state) => ({ employees: [...state.employees, employee] }));
                get().invalidateCache();
            },
            updateEmployee: (id, updates) => {
                set((state) => ({
                    employees: state.employees.map(e => e.id === id ? { ...e, ...updates } : e)
                }));
                get().invalidateCache();
            },
            deleteEmployee: (id) => {
                set((state) => ({ employees: state.employees.filter(e => e.id !== id) }));
                get().invalidateCache();
            },

            addGroup: (group) => {
                set((state) => ({ groups: [...state.groups, group] }));
                get().invalidateCache();
            },
            updateGroup: (id, updates) => {
                set((state) => ({
                    groups: state.groups.map(g => g.id === id ? { ...g, ...updates } : g)
                }));
                get().invalidateCache();
            },
            deleteGroup: (id) => {
                set((state) => ({
                    groups: state.groups.filter(g => g.id !== id),
                    participants: state.participants.filter(p => p.groupId !== id)
                }));
                get().invalidateCache();
            },

            addParticipant: (participant) => {
                set((state) => ({ participants: [...state.participants, participant] }));
                get().invalidateCache();
            },
            updateParticipant: (id, updates) => {
                set((state) => ({
                    participants: state.participants.map(p => p.id === id ? { ...p, ...updates } : p)
                }));
                get().invalidateCache();
            },
            removeParticipant: (id) => {
                set((state) => ({
                    participants: state.participants.filter(p => p.id !== id)
                }));
                get().invalidateCache();
            },

            addSpecification: (spec) => {
                set((state) => ({ specifications: [...state.specifications, spec] }));
                get().invalidateCache();
            },
            updateSpecification: (id, updates) => {
                set((state) => ({
                    specifications: state.specifications.map(s => s.id === id ? { ...s, ...updates } : s)
                }));
                get().invalidateCache();
            },
            deleteSpecification: (id) => {
                set((state) => ({ specifications: state.specifications.filter(s => s.id !== id) }));
                get().invalidateCache();
            },
        }),
        {
            name: 'erp-storage',
        }
    )
);