import { create } from 'zustand';
import { articleService } from '../services';

const useArticleStore = create((set) => ({
    articles: [],
    currentArticle: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    },
    loading: false,
    error: null,

    fetchArticles: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
                if (value !== '' && value !== null && value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {});

            const response = await articleService.getArticles(cleanParams);
            set({
                articles: response.data.articles,
                pagination: response.data.pagination,
                loading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch articles',
                loading: false,
            });
        }
    },

    fetchArticleById: async (id) => {
        set({ loading: true, error: null });
        try {
            const response = await articleService.getArticleById(id);
            set({
                currentArticle: response.data.article,
                loading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch article',
                loading: false,
            });
        }
    },

    createArticle: async (articleData) => {
        set({ loading: true, error: null });
        try {
            const response = await articleService.createArticle(articleData);
            set((state) => ({
                articles: [response.data.article, ...state.articles],
                loading: false,
            }));
            return response;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to create article',
                loading: false,
            });
            throw error;
        }
    },

    updateArticle: async (id, articleData) => {
        set({ loading: true, error: null });
        try {
            const response = await articleService.updateArticle(id, articleData);
            set((state) => ({
                articles: state.articles.map((article) =>
                    article.id === id ? response.data.article : article
                ),
                currentArticle: response.data.article,
                loading: false,
            }));
            return response;
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to update article',
                loading: false,
            });
            throw error;
        }
    },

    deleteArticle: async (id) => {
        set({ loading: true, error: null });
        try {
            await articleService.deleteArticle(id);
            set((state) => ({
                articles: state.articles.filter((article) => article.id !== id),
                loading: false,
            }));
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to delete article',
                loading: false,
            });
            throw error;
        }
    },

    clearCurrentArticle: () => set({ currentArticle: null }),

    clearError: () => set({ error: null }),
}));

export default useArticleStore;
