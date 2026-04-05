
export interface Company {
    id: number;
    code: string;
    name: string;
}

export interface Employee {
    id: number;
    fullName: string;
    companyId: number;
    email: string;
}

export interface Course {
    id: number;
    name: string;
    description: string;
    durationDays: number;
    price: number;
}

export interface TrainingGroup {
    id: number;
    courseId: number;
    startDate: Date;
    endDate: Date;
    pricePerPerson: number;
    participantCount: number;
    status: string;
    totalCost: number;
    averageProgress: number;
    specificationId?: number;
}

export interface GroupMember {
    id: number;
    studentId: number;
    groupId: number;
    completionPercent: number;
}

export interface Specification {
    id: number;
    date: Date;
    number: number;
    companyId: number;
    totalAmount: number;
    vatAmount: number;
    totalWithVat: number;
}

export interface Status {
    id: number;
    name: string;
}

export interface CourseBasicStats {
    totalDuration: number;
    minDuration: number;
    maxDuration: number;
    avgDuration: number;
}

export interface AnalyticsState {
    courseCount: number;
    courseBasicStats: CourseBasicStats | null;

    totalCompanies: number;
    totalEmployees: number;
    totalGroups: number;
    totalSpecifications: number;
    averageGroupProgress: number;
    totalRevenue: number;
}

export interface IdTrainingGroupPairs {
    id1: number;
    id2: number;
}

export interface ListTrainingGroup {
    groups: TrainingGroup[];
    intersections: IdTrainingGroupPairs[];
}