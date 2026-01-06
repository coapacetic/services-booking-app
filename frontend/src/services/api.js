import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Opportunity endpoints
export const getOpportunities = (params = {}) => {
  return api.get('/opportunities', { params });
};

export const getOpportunity = (id) => {
  return api.get(`/opportunities/${id}`);
};

export const createOpportunity = (data) => {
  return api.post('/opportunities', data);
};

export const updateOpportunity = (id, data) => {
  return api.put(`/opportunities/${id}`, data);
};

export const deleteOpportunity = (id) => {
  return api.delete(`/opportunities/${id}`);
};

// Stats endpoint
export const getOpportunityStats = () => {
  return api.get('/stats');
};

export default api;
