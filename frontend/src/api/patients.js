import api from './axios';

export const getAllPatients   = ()         => api.get('/patients');
export const registerPatient = (data)     => api.post('/patients', data);
export const updatePatient   = (id, data) => api.patch(`/patients/${id}`, data);
export const deletePatient   = (id)       => api.delete(`/patients/${id}`);