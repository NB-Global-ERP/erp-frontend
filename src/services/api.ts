import * as raw from './rawApi';
import {
    mapCourse,
    mapEmployee,
    mapGroup,
    mapSpecification,
    mapCompany,
    mapStatuses, mapStats, mapGroupMember
} from '@/utils/adapters';

import type {
    Course,
    Employee,
    TrainingGroup,
    Specification,
    Company, Status,
    CourseBasicStats, GroupMember
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
    CourseCompletionStatusRequest,
    CourseCompletionStatusPatchRequest,
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

export const getCoursesCount = async (): Promise<number> =>
    raw.getCoursesCountRaw();

export const getCoursesBasicStats = async (): Promise<CourseBasicStats> =>
    mapStats(await raw.getCoursesBasicStatsRaw());

export const getEmployees = async (): Promise<Employee[]> =>
    (await raw.getStudentsRaw()).map(mapEmployee);

export const getEmployee = async (id: number): Promise<Employee> =>
    mapEmployee(await raw.getStudentRaw(id));

export const createEmployee = async (data: StudentRequest): Promise<CreateResponse> =>
    raw.createStudentRaw(data);

export const updateEmployee = async (id: number, data: StudentPatchRequest): Promise<Employee> =>
    mapEmployee(await raw.updateStudentRaw(id, data));

export const deleteEmployee = async (id: number): Promise<void> =>
    raw.deleteStudentRaw(id);

export const getGroups = async (): Promise<TrainingGroup[]> =>
    (await raw.getGroupsRaw()).map(mapGroup);

export const getGroup = async (id: number): Promise<TrainingGroup> =>
    mapGroup(await raw.getGroupRaw(id));

export const createGroup = async (data: GroupRequest): Promise<CreateResponse> =>
    raw.createGroupRaw(data);

export const updateGroup = async (id: number, data: GroupPatchRequest): Promise<TrainingGroup> =>
    mapGroup(await raw.updateGroupRaw(id, data));

export const deleteGroup = async (id: number): Promise<void> =>
    raw.deleteGroupRaw(id);

export const addStudentToGroup = async (
    groupId: number,
    studentId: number
): Promise<void> =>
    raw.addStudentToGroupRaw(groupId, studentId);

export const getGroupMembers = async (groupId: number): Promise<GroupMember[]> =>
    (await raw.getGroupMembersRaw(groupId)).map(mapGroupMember);

export const patchGroupMembers = async (
    groupId: number,
    patches: { id: number; completionPercent: number }[]
): Promise<GroupMember[]> =>
    (await raw.patchGroupMembersRaw(groupId, patches)).map(mapGroupMember);

export const getSpecifications = async (): Promise<Specification[]> =>
    (await raw.getSpecificationsRaw()).map(mapSpecification);

export const getSpecification = async (id: number): Promise<Specification> =>
    mapSpecification(await raw.getSpecificationRaw(id));

export const createSpecification = async (data: SpecificationRequest): Promise<CreateResponse> =>
    raw.createSpecificationRaw(data);

export const updateSpecification = async (id: number, data: SpecificationPatchRequest): Promise<Specification> =>
    mapSpecification(await raw.updateSpecificationRaw(id, data));

export const deleteSpecification = async (id: number): Promise<void> =>
    raw.deleteSpecificationRaw(id);

export const getStatuses = async (): Promise<Status[]> =>
    (await raw.getCourseCompletionStatusesListRaw()).map(mapStatuses);

export const getStatus = async (id: number): Promise<Status> =>
    mapStatuses(await raw.getCourseCompletionStatusRaw(id));

export const createStatus = async (
    data: CourseCompletionStatusRequest
): Promise<CreateResponse> =>
    raw.createCourseCompletionStatusRaw(data);

export const updateStatus = async (
    id: number,
    data: CourseCompletionStatusPatchRequest
): Promise<Status> =>
    mapStatuses(await raw.updateCourseCompletionStatusRaw(id, data));

export const deleteStatus = async (id: number): Promise<void> =>
    raw.deleteCourseCompletionStatusRaw(id);

export const getCompanies = async (): Promise<Company[]> =>
    (await raw.getCompaniesListRaw()).map(mapCompany);

export const getCompaniesCount = async (): Promise<number> => {
    const response = await raw.getCompaniesCountRaw();
    return response.count;
};

export const getCompany = async (id: number): Promise<Company> =>
    mapCompany(await raw.getCompanyRaw(id));

export const createCompany = async (data: CompanyRequest): Promise<CreateResponse> =>
    raw.createCompanyRaw(data);

export const updateCompany = async (id: number, data: CompanyPatchRequest): Promise<Company> =>
    mapCompany(await raw.updateCompanyRaw(id, data));

export const deleteCompany = async (id: number): Promise<void> =>
    raw.deleteCompanyRaw(id);