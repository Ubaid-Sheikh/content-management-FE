import { create } from 'zustand';
import { authService } from '../services';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,

    // Login action
    login: async (credentials) => {
        set({ loading: true, error: null });
        try {
            const response = await authService.login(credentials);
            const { user, token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            set({
                user,
                token,
                isAuthenticated: true,
                loading: false,
            });

            return response;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Login failed',
                loading: false,
            });
            throw error;
        }
    },

    // Register action
    register: async (userData) => {
        set({ loading: true, error: null });
        try {
            const response = await authService.register(userData);
            const { user, token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            set({
                user,
                token,
                isAuthenticated: true,
                loading: false,
            });

            return response;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Registration failed',
                loading: false,
            });
            throw error;
        }
    },

    // Logout action
    logout: () => {
        authService.logout();
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
        });
    },

    // Clear error
    clearError: () => set({ error: null }),
}));

export default useAuthStore;
