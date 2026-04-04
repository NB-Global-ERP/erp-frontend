import axios from 'axios';

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

export const getCoursesRaw = () => apiClient.get('/courses');

export const getCourseRaw = (id: number) =>
    apiClient.get('/courses', { params: { id } });

export const createCourseRaw = (data: any) =>
    apiClient.post('/courses', data);

export const updateCourseRaw = (id: number, data: any) =>
    apiClient.patch('/courses', data, { params: { id } });

export const deleteCourseRaw = (id: number) =>
    apiClient.delete('/courses', { params: { id } });

export const getStudentsRaw = () => apiClient.get('/students');

export const createStudentRaw = (data: any) =>
    apiClient.post('/students', data);

export const updateStudentRaw = (id: number, data: any) =>
    apiClient.patch('/students', data, { params: { id } });

export const deleteStudentRaw = (id: number) =>
    apiClient.delete('/students', { params: { id } });

export const getGroupsRaw = () => apiClient.get('/groups');

export const createGroupRaw = (data: any) =>
    apiClient.post('/groups', data);

export const updateGroupRaw = (id: number, data: any) =>
    apiClient.patch('/groups', data, { params: { id } });

export const deleteGroupRaw = (id: number) =>
    apiClient.delete('/groups', { params: { id } });

export const addStudentToGroupRaw = (groupId: number, studentId: number) =>
    apiClient.post(`/groups/${groupId}/add/student/${studentId}`);

export const getSpecificationsRaw = () => apiClient.get('/specifications');

export const createSpecificationRaw = (data: any) =>
    apiClient.post('/specifications', data);

export const updateSpecificationRaw = (id: number, data: any) =>
    apiClient.patch('/specifications', data, { params: { id } });

export const deleteSpecificationRaw = (id: number) =>
    apiClient.delete('/specifications', { params: { id } });

export const getCompaniesRaw = () => apiClient.get('/companies');

export const createCompanyRaw = (data: any) =>
    apiClient.post('/companies', data);

export const updateCompanyRaw = (id: number, data: any) =>
    apiClient.patch('/companies', data, { params: { id } });

export const deleteCompanyRaw = (id: number) =>
    apiClient.delete('/companies', { params: { id } });