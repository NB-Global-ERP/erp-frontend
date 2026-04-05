export interface CreateResponse {
    id: number;
}

export interface StudentResponse {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    companyId: number;
    email: string;
}

export interface GroupResponse {
    id: number;
    courseId: number;
    dateBegin: string;
    dateEnd: string;
    pricePerPerson: number;
    participantCount: number;
    groupPrice: number;
    courseCompletion: string;
    averageProgress: number;
    specificationId: number;
}

export interface CompanyResponse {
    id: number;
    companyCode: string;
    companyName: string;
}

export interface CourseResponse {
    id: number;
    name: string;
    description: string;
    durationInDays: number;
    pricePerPerson: number;
}

export interface GroupResponse {
    id: number;
    courseId: number;
    dateBegin: string;
    dateEnd: string;
    pricePerPerson: number;
    participantCount: number;
    groupPrice: number;
    courseCompletion: string;
    averageProgress: number;
    specificationId: number;
}

export interface SpecificationResponse {
    id: number;
    date: string;
    number: number;
    companyId: number;
    totalAmountExcludingVat: number;
    vatAmount22Percent: number;
    totalAmountIncludingVat: number;
}

export interface CourseRequest {
    name: string;
    description: string;
    durationInDays: number;
    pricePerPerson: number;
}

export interface CoursePatchRequest {
    name?: string;
    description?: string;
    durationInDays?: number;
    pricePerPerson?: number;
}

export interface StudentRequest {
    firstName: string;
    middleName: string;
    lastName: string;
    companyId: number;
    email: string;
}

export interface StudentPatchRequest {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    companyId?: number;
    email?: string;
}

export interface GroupRequest {
    courseId: number;
    dateBegin: string;
    courseCompletionId: number;
    specificationId: number;
}

export interface GroupPatchRequest {
    courseId?: number;
    dateBegin?: string;
    courseCompletionId?: number;
    specificationId?: number;
}

export interface SpecificationRequest {
    datetime: string;
    number: number;
    companyId: number;
}

export type SpecificationPatchRequest = Partial<SpecificationRequest>

export interface CompanyRequest {
    companyCode: string;
    companyName: string;
}

export interface CompanyPatchRequest {
    companyCode?: string;
    companyName?: string;
}

export interface CourseCompletionStatusResponse {
    id: number;
    name: string;  // "Планируется", "В процессе", "Завершён", "Отменён"
}

export interface CourseCompletionStatusRequest {
    name: string;
}

export interface CourseCompletionStatusPatchRequest {
    name?: string;
}

export interface CourseBasicStatsResponse {
    sum: number;
    avg: number;
    min: number;
    max: number;
}

export interface GroupMemberResponse {
    id: number;
    studentId: number;
    groupId: number;
    completionPercent: number;
}

export interface GroupMemberPatchRequest {
    id: number;
    completionPercent: number; // 0.0 – 1.0
}