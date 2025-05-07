import axios from 'axios';

const API_URL = 'https://edu-papers-backend-0.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Authentication API calls
export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await api.post('/auth/reset-password', {
    token,
    password
  });

  return response.data;
};


export const registerUser = async (name: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};


export const logoutUser = async () => {
  const response = await api.get('/auth/logout');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Question Papers API calls
export const getQuestionPapers = async (
  page = 1, 
  limit = 10, 
  search = '', 
  subject = '', 
  year = '', 
  semester = ''
) => {
  const response = await api.get('/papers', { 
    params: { page, limit, search, subject, year, semester } 
  });
  return response.data;
};

export const getQuestionPaperById = async (id: string) => {
  const response = await api.get(`/papers/${id}`);
  return response.data;
};

export const uploadQuestionPaper = async (formData: FormData) => {

  const response = await api.post('/papers', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};


// User API calls
export const getUserProfile = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const updateUserProfile = async (id: string, userData: FormData) => {
  const response = await api.put(`/users/${id}`, userData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getQuestionPaperByUserId = async (uploadedByid: string) => {
  const response = await api.get(`/papers/user/${uploadedByid}`);
  return response.data;
};

export const deleteQuestionPaperById = async (id: string) => {
  const response = await api.delete(`/papers/${id}`);
  return response.data;
};


export default api;
