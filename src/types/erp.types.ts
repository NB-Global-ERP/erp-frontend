/** Участник обучения */
export interface Employee {
    id: string;
    fullName: string;
    companyId: string;
    email: string;
    groupIds: string[];
}

/** Курс обучения */
export interface Course {
    id: string;
    code: string;
    name: string;
    description?: string;
    durationDays: number;
    pricePerPerson: number;
    priceHistory?: PriceHistory[];
}

/** История цен */
export interface PriceHistory {
    courseId: string;
    price: number;
    validFrom: Date;
    validTo?: Date;
}

/** Учебная группа */
export interface TrainingGroup {
    id: string;
    courseId: string;
    startDate: Date;
    endDate: Date;
    pricePerPerson: number;
    status: GroupStatus;
    specificationId?: string;
    participants: GroupParticipant[];
}

/** Статус группы */
export type GroupStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

/** Участник группы */
export interface GroupParticipant {
    id: string;
    groupId: string;
    employeeId: string;
    progressPercent: number;
    certificateUrl?: string;
}

/** Спецификация */
export interface Specification {
    id: string;
    documentId: string;
    date: Date;
    number: string;
    companyId: string;
    groupIds: string[];
    totalAmount: number;
    vatAmount: number;
    totalWithVat: number;
}

/** Компания */
export interface Company {
    id: string;
    code: string;
    name: string;
}

/** Вычисляемые поля для группы */
export interface TrainingGroupCalculated {
    participantCount: number;
    totalCost: number;
    averageProgress: number;
}

/** Полная группа с вычисляемыми полями */
export interface TrainingGroupFull extends TrainingGroup, TrainingGroupCalculated {}

/** Спецификация с вычисляемыми полями */
export interface SpecificationFull extends Specification {
    groups: TrainingGroupFull[];
}