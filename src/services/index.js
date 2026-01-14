import api from './api';

/**
 * Authentication Service
 */
export const authService = {
    // Register new user
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    // Get current user profile
    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};

/**
 * Article Service
 */
export const articleService = {
    // Get all articles with pagination
    getArticles: async (params = {}) => {
        const response = await api.get('/articles', { params });
        return response.data;
    },

    // Get article by ID
    getArticleById: async (id) => {
        const response = await api.get(`/articles/${id}`);
        return response.data;
    },

    // Create new article
    createArticle: async (articleData) => {
        const response = await api.post('/articles', articleData);
        return response.data;
    },

    // Update article
    updateArticle: async (id, articleData) => {
        const response = await api.put(`/articles/${id}`, articleData);
        return response.data;
    },

    // Delete article
    deleteArticle: async (id) => {
        const response = await api.delete(`/articles/${id}`);
        return response.data;
    },
};
