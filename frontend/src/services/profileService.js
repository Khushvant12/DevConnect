import api from './api.js';

export const profileService = {
  getMyProfile: () => api.get('/profile/me'),

  updateProfile: (payload) => api.put('/profile/update', payload),

  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getProfile: (idOrUsername) => api.get(`/profile/${idOrUsername}`),

  searchDevelopers: (params) => api.get('/profile/all', { params }),
};
