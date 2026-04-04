import axios from 'axios';

import type {
    CourseResponse,
    StudentResponse,
    GroupResponse,
    SpecificationResponse,
    CompanyResponse,
    CourseCompletionStatusResponse,
    CreateResponse,
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
    CourseBasicStatsResponse
} from '@/types/api.types';

export const apiClient = axios.create({
    baseURL: 'http://localhost:8091/api/v1',
    headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
    (res) => res.data,
    (err) => {
        const message = err.response?.data?.message || err.message;
        return Promise.reject(new Error(message));
    }
);

export const getCoursesRaw = (): Promise<CourseResponse[]> =>
    apiClient.get('/courses/list');

export const getCourseRaw = (id: number): Promise<CourseResponse> =>
    apiClient.get('/courses', { params: { id } });

export const createCourseRaw = (
    data: CourseRequest
): Promise<CreateResponse> =>
    apiClient.post('/courses', data);

export const updateCourseRaw = (
    id: number,
    data: CoursePatchRequest
): Promise<CourseResponse> =>
    apiClient.patch('/courses', data, { params: { id } });

export const deleteCourseRaw = (id: number): Promise<void> =>
    apiClient.delete('/courses', { params: { id } });

export const getCoursesCountRaw = (): Promise<number> =>
    apiClient.get('/courses/analytics/count');

export const getCoursesBasicStatsRaw = (): Promise<CourseBasicStatsResponse> =>
    apiClient.get('/courses/analytics/basicStats/dayDuration');

export const getStudentsRaw = (): Promise<StudentResponse[]> =>
    apiClient.get('/students');

export const getStudentRaw = (id: number): Promise<StudentResponse> =>
    apiClient.get(`/students/${id}`);

export const createStudentRaw = (data: StudentRequest): Promise<CreateResponse> =>
    apiClient.post('/students', data);

export const updateStudentRaw = (
    id: number,
    data: StudentPatchRequest
): Promise<StudentResponse> =>
    apiClient.patch('/students', data, { params: { id } });

export const deleteStudentRaw = (id: number): Promise<void> =>
    apiClient.delete('/students', { params: { id } });

export const getGroupsRaw = (): Promise<GroupResponse[]> =>
    apiClient.get('/groups/list');

export const getGroupRaw = (id: number): Promise<GroupResponse> =>
    apiClient.get('/groups', { params: { id } });

export const createGroupRaw = (data: GroupRequest): Promise<CreateResponse> =>
    apiClient.post('/groups', data);

export const updateGroupRaw = (id: number, data: GroupPatchRequest): Promise<GroupResponse> =>
    apiClient.patch('/groups', data, { params: { id } });

export const deleteGroupRaw = (id: number): Promise<void> =>
    apiClient.delete('/groups', { params: { id } });

export const addStudentToGroupRaw = (groupId: number, studentId: number): Promise<void> =>
    apiClient.post(`/groups/${groupId}/add/student/${studentId}`);

export const getSpecificationsRaw = (): Promise<SpecificationResponse[]> =>
    apiClient.get('/specifications');

export const getSpecificationRaw = (id: number): Promise<SpecificationResponse> =>
    apiClient.get('/specifications', { params: { id } });

export const createSpecificationRaw = (data: SpecificationRequest): Promise<CreateResponse> =>
    apiClient.post('/specifications/list', data);

export const updateSpecificationRaw = (id: number, data: SpecificationPatchRequest): Promise<SpecificationResponse> =>
    apiClient.patch('/specifications', data, { params: { id } });

export const deleteSpecificationRaw = (id: number): Promise<void> =>
    apiClient.delete('/specifications', { params: { id } });

export const getCourseCompletionStatusesListRaw = (): Promise<CourseCompletionStatusResponse[]> =>
    apiClient.get('/course-completion-statuses/list');

export const getCourseCompletionStatusRaw = (id: number): Promise<CourseCompletionStatusResponse> =>
    apiClient.get('/course-completion-statuses', { params: { id } });

export const createCourseCompletionStatusRaw = (data: CourseCompletionStatusRequest): Promise<CreateResponse> =>
    apiClient.post('/course-completion-statuses', data);

export const updateCourseCompletionStatusRaw = (
    id: number,
    data: CourseCompletionStatusPatchRequest
): Promise<CourseCompletionStatusResponse> =>
    apiClient.patch('/course-completion-statuses', data, { params: { id } });

export const deleteCourseCompletionStatusRaw = (id: number): Promise<void> =>
    apiClient.delete('/course-completion-statuses', { params: { id } });

export const getCompaniesListRaw = (): Promise<CompanyResponse[]> =>
    apiClient.get('/companies/list');

export const getCompaniesCountRaw = (): Promise<number> =>
    apiClient.get('/companies/count');

export const getCompanyRaw = (id: number): Promise<CompanyResponse> =>
    apiClient.get('/companies', { params: { id } });

export const createCompanyRaw = (data: CompanyRequest): Promise<CreateResponse> =>
    apiClient.post('/companies', data);

export const updateCompanyRaw = (
    id: number,
    data: CompanyPatchRequest
): Promise<CompanyResponse> =>
    apiClient.patch('/companies', data, { params: { id } });

export const deleteCompanyRaw = (id: number): Promise<void> =>
    apiClient.delete('/companies', { params: { id } });