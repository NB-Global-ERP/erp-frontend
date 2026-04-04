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
    totalCost: number;
    averageProgress: number;
    specificationId?: number;
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