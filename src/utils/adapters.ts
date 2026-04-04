import type {
    CompanyResponse,
    StudentResponse,
    CourseResponse,
    GroupResponse,
    SpecificationResponse, CourseCompletionStatusResponse
} from '@/types/api.types';

import type {
    Company,
    Employee,
    Course,
    TrainingGroup,
    Specification, Status
} from '@/types/erp.types';

export const mapCompany = (c: CompanyResponse): Company => ({
    id: c.id,
    code: c.companyCode,
    name: c.companyName,
});

export const mapEmployee = (s: StudentResponse): Employee => ({
    id: s.id,
    fullName: `${s.lastName} ${s.firstName} ${s.middleName}`,
    companyId: s.companyId,
    email: s.email,
});

export const mapCourse = (c: CourseResponse): Course => ({
    id: c.id,
    name: c.name,
    description: c.description,
    durationDays: c.durationInDays,
    price: Number(c.pricePerPerson),
});

export const mapGroup = (g: GroupResponse): TrainingGroup => ({
    id: g.id,
    courseId: g.courseId,
    startDate: new Date(g.dateBegin),
    endDate: new Date(g.dateEnd),
    pricePerPerson: Number(g.pricePerPerson),
    participantCount: g.participantCount,
    status: g.courseCompletion,
    totalCost: Number(g.groupPrice),
    averageProgress: g.averageProgress,
    specificationId: g.specificationId,
});

export const mapSpecification = (s: SpecificationResponse): Specification => ({
    id: s.id,
    date: new Date(s.date),
    number: s.number,
    companyId: s.companyId,
    totalAmount: Number(s.totalAmountExcludingVat),
    vatAmount: Number(s.vatAmount22Percent),
    totalWithVat: Number(s.totalAmountIncludingVat),
});

export const mapStatuses = (s: CourseCompletionStatusResponse): Status => ({
    id: s.id,
    name: s.name,
});