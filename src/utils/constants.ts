export const API_ENDPOINTS = {
    BUDGET: '/api/budget',
    TRAINING_PLAN: '/api/training/plan',
    EMPLOYEES: '/api/employees',
    DEPARTMENTS: '/api/departments',
    REPORTS: '/api/reports',
    AUTH: '/api/auth',
} as const;

export const REQUEST_STATUS = {
    DRAFT: { value: 'draft', label: 'Черновик', color: 'bg-gray-100 text-gray-800' },
    PENDING: { value: 'pending', label: 'На согласовании', color: 'bg-yellow-100 text-yellow-800' },
    APPROVED: { value: 'approved', label: 'Согласовано', color: 'bg-green-100 text-green-800' },
    REJECTED: { value: 'rejected', label: 'Отклонено', color: 'bg-red-100 text-red-800' },
    IN_PROGRESS: { value: 'in_progress', label: 'В процессе', color: 'bg-blue-100 text-blue-800' },
    COMPLETED: { value: 'completed', label: 'Завершено', color: 'bg-emerald-100 text-emerald-800' },
} as const;

export type RequestStatus = typeof REQUEST_STATUS[keyof typeof REQUEST_STATUS];

export const DEPARTMENTS = [
    { id: 'it', name: 'IT', budget: 1000000, head: 'Иванов И.И.' },
    { id: 'hr', name: 'HR', budget: 500000, head: 'Петрова Е.В.' },
    { id: 'finance', name: 'Finance', budget: 750000, head: 'Сидоров А.А.' },
    { id: 'sales', name: 'Sales', budget: 800000, head: 'Козлов Д.С.' },
    { id: 'marketing', name: 'Marketing', budget: 600000, head: 'Смирнова О.Н.' },
] as const;

export const STATUS_OPTIONS = [
    {id: 1, label: "Планируется", value: "planned"},
    {id: 2, label: "В процессе", value: "in_progress"},
    {id: 3, label: "Завершено", value: "completed"},
    {id: 4, label: "Отменено", value: "cancelled"}
] as const;

export const STATUS_OPTIONS_FOR_GRID = [
    { id: "planned", label: "Планируется" },
    { id: "in_progress", label: "В процессе" },
    { id: "completed", label: "Завершено" },
    { id: "cancelled", label: "Отменено" }
] as const;



export const STATUS_MAPPER = {
    "planned": "Планируется",
    "in_progress": "В процессе",
    "completed": "Завершено",
    "cancelled": "Отменено"
} as const;

export const USER_ROLES = {
    ADMIN: { value: 'admin', label: 'Администратор', level: 100 },
    MANAGER: { value: 'manager', label: 'Руководитель', level: 50 },
    EMPLOYEE: { value: 'employee', label: 'Сотрудник', level: 10 },
} as const;

export const TIME = {
    SECOND: 1000,
    MINUTE: 60 * 1000,
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
    WEEK: 7 * 24 * 60 * 60 * 1000,
    MONTH: 30 * 24 * 60 * 60 * 1000,
} as const;

export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 50,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100, 250, 500] as const,
    DEFAULT_PAGE: 1,
} as const;

export const COLORS = {
    primary: '#902bf5',
    secondary: '#a0c950',
    accent: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4',
    gray: '#6b7280',
} as const;

export const GANTT_STATUS_COLORS = {
    planned: COLORS.accent,
    in_progress: COLORS.warning,
    completed: COLORS.success,
    delayed: COLORS.error,
    cancelled: COLORS.gray,
} as const;

export const NOTIFICATION_TYPES = {
    INFO: { value: 'info', icon: 'ℹ️', color: 'blue' },
    SUCCESS: { value: 'success', icon: '✅', color: 'green' },
    WARNING: { value: 'warning', icon: '⚠️', color: 'yellow' },
    ERROR: { value: 'error', icon: '❌', color: 'red' },
} as const;

export const REGEX = {
    EMAIL: /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/,
    PHONE: /^\+?[78][-(]?\d{3}\)?-?\d{3}-?\d{2}-?\d{2}$/,
    INN: /^\d{10}$|^\d{12}$/,
    KPP: /^\d{9}$/,
    BIK: /^\d{9}$/,
    PASSPORT: /^\d{4}\s?\d{6}$/,
} as const;

export const MONTHS = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
] as const;