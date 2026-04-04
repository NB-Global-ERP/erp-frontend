import * as raw from './rawApi';
import {
    mapCourse,
    mapEmployee,
    mapGroup,
    mapSpecification,
    mapCompany
} from '@/utils/adapters';

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
    CompanyPatchRequest,
    CreateResponse
} from '@/types/api.types';

export const getCourses = async (): Promise<Course[]> =>
    (await raw.getCoursesRaw()).map(mapCourse);

export const getCourse = async (id: number): Promise<Course> =>
    mapCourse(await raw.getCourseRaw(id));

export const createCourse = async (
    data: CourseRequest
): Promise<CreateResponse> =>
    raw.createCourseRaw(data);

export const updateCourse = async (
    id: number,
    data: CoursePatchRequest
): Promise<Course> =>
    mapCourse(await raw.updateCourseRaw(id, data));

export const deleteCourse = async (id: number): Promise<void> =>
    raw.deleteCourseRaw(id);

export const getEmployees = async (): Promise<Employee[]> =>
    (await raw.getStudentsRaw()).map(mapEmployee);

export const createEmployee = async (
    data: StudentRequest
): Promise<CreateResponse> =>
    raw.createStudentRaw(data);

export const updateEmployee = async (
    id: number,
    data: StudentPatchRequest
): Promise<Employee> =>
    mapEmployee(await raw.updateStudentRaw(id, data));

export const deleteEmployee = async (id: number): Promise<void> =>
    raw.deleteStudentRaw(id);

export const getGroups = async (): Promise<TrainingGroup[]> =>
    (await raw.getGroupsRaw()).map(mapGroup);

export const createGroup = async (
    data: GroupRequest
): Promise<CreateResponse> =>
    raw.createGroupRaw(data);

export const updateGroup = async (
    id: number,
    data: GroupPatchRequest
): Promise<TrainingGroup> =>
    mapGroup(await raw.updateGroupRaw(id, data));

export const deleteGroup = async (id: number): Promise<void> =>
    raw.deleteGroupRaw(id);

export const addStudentToGroup = async (
    groupId: number,
    studentId: number
): Promise<void> =>
    raw.addStudentToGroupRaw(groupId, studentId);

export const getSpecifications = async (): Promise<Specification[]> =>
    (await raw.getSpecificationsRaw()).map(mapSpecification);

export const createSpecification = async (
    data: SpecificationRequest
): Promise<CreateResponse> =>
    raw.createSpecificationRaw(data);

export const updateSpecification = async (
    id: number,
    data: SpecificationPatchRequest
): Promise<Specification> =>
    mapSpecification(await raw.updateSpecificationRaw(id, data));

export const deleteSpecification = async (id: number): Promise<void> =>
    raw.deleteSpecificationRaw(id);

export const getCompanies = async (): Promise<Company[]> =>
    (await raw.getCompaniesRaw()).map(mapCompany);

export const createCompany = async (
    data: CompanyRequest
): Promise<CreateResponse> =>
    raw.createCompanyRaw(data);

export const updateCompany = async (
    id: number,
    data: CompanyPatchRequest
): Promise<Company> =>
    mapCompany(await raw.updateCompanyRaw(id, data));

export const deleteCompany = async (id: number): Promise<void> =>
    raw.deleteCompanyRaw(id);