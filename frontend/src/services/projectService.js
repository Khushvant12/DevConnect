import api from './api.js';

export const projectService = {
  create: (formData) =>
    api.post('/projects/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getAll: (params) => api.get('/projects/all', { params }),

  getById: (id) => api.get(`/projects/${id}`),

  update: (id, formData) =>
    api.put(`/projects/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id) => api.delete(`/projects/${id}`),

  toggleLike: (id) => api.post(`/projects/like/${id}`),

  toggleSave: (id) => api.post(`/projects/save/${id}`),

  getSaved: () => api.get('/projects/saved'),

  getComments: (projectId) => api.get(`/projects/${projectId}/comments`),

  addComment: (projectId, text) =>
    api.post(`/projects/comment/${projectId}`, { text }),

  updateComment: (commentId, text) =>
    api.put(`/projects/comments/${commentId}`, { text }),

  deleteComment: (commentId) => api.delete(`/projects/comments/${commentId}`),
};
