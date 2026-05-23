import api from './api.js';

export const teamRequestService = {
  send: (payload) => api.post('/team-requests/send', payload),
  incoming: () => api.get('/team-requests/incoming'),
  outgoing: () => api.get('/team-requests/outgoing'),
  status: (userId) => api.get(`/team-requests/status/${userId}`),
  accept: (id) => api.put(`/team-requests/${id}/accept`),
  reject: (id) => api.put(`/team-requests/${id}/reject`),
  cancel: (id) => api.delete(`/team-requests/${id}/cancel`),
};
