import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useArticleStore from '../store/articleStore';

const ArticleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentArticle, createArticle, updateArticle, fetchArticleById } = useArticleStore();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        status: 'DRAFT',
        image: null,
    });

    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const isEditMode = !!id;

    const resetForm = useCallback(() => {
        setFormData({ title: '', content: '', status: 'DRAFT', image: null });
        setPreview(null);
        setFieldErrors({});
    }, []);

    useEffect(() => {
        if (isEditMode) {
            fetchArticleById(id).catch(err => {
                toast.error('Could not load article for editing');
                navigate('/');
            });
        } else {
            resetForm();
        }
    }, [id, isEditMode, fetchArticleById, navigate, resetForm]);

    useEffect(() => {
        if (isEditMode && currentArticle && currentArticle.id === id) {
            setFormData({
                title: currentArticle.title || '',
                content: currentArticle.content || '',
                status: currentArticle.status || 'DRAFT',
                image: null,
            });
            if (currentArticle.imageUrl) {
                setPreview(currentArticle.imageUrl);
            }
        }
    }, [currentArticle, isEditMode, id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image is too large (Max 5MB)');
                return;
            }
            setFormData(prev => ({ ...prev, image: file }));
            setPreview(URL.createObjectURL(file));
            setFieldErrors(prev => ({ ...prev, image: null }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (formData.title.trim().length < 3) errors.title = 'Title must be at least 3 characters';
        if (formData.content.trim().length < 10) errors.content = 'Content must be at least 10 characters';

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.warn('Please check the form for errors');
            return;
        }

        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title.trim());
            data.append('content', formData.content.trim());
            data.append('status', formData.status);

            if (formData.image) {
                data.append('image', formData.image);
            }

            if (isEditMode) {
                await updateArticle(id, data);
                toast.success('Changes saved successfully');
            } else {
                await createArticle(data);
                toast.success('Story published successfully');
            }
            navigate('/');
        } catch (error) {
            console.error('Submission error:', error);
            const responseData = error.response?.data;

            if (responseData?.errors) {
                const mappedErrors = {};
                responseData.errors.forEach(err => {
                    const field = err.field.split('.').pop();
                    mappedErrors[field] = err.message;
                    toast.error(`${field}: ${err.message}`);
                });
                setFieldErrors(mappedErrors);
            } else if (responseData?.message) {
                toast.error(responseData.message);
            } else if (error.request) {
                toast.error('Network error. Please check your connection or try again later.');
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-20 fade-in bg-white">
            <div className="mb-16">
                <Link to="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors mb-8 inline-block italic">
                    ← Discard & Return
                </Link>
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight mt-4">
                    {isEditMode ? 'Refine your story' : 'Write a new story'}
                </h1>
                <p className="text-slate-400 text-sm mt-2">Share your thoughts with the workspace.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                <div className="space-y-10">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Cover Image (Optional)</label>
                        <div className={`relative group rounded-3xl overflow-hidden border-2 border-dashed transition-all ${fieldErrors.image ? 'border-rose-200' : 'border-slate-100 hover:border-slate-200'}`}>
                            <div className={`w-full aspect-[21/9] bg-slate-50 flex items-center justify-center ${preview ? 'bg-transparent' : ''}`}>
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center group-hover:scale-105 transition-transform">
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Add Cover Image</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept="image/*"
                                />
                            </div>
                            {preview && (
                                <button
                                    type="button"
                                    onClick={() => { setPreview(null); setFormData(p => ({ ...p, image: null })); }}
                                    className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-2 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                >
                                    <svg className="w-4 h-4 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Title</label>
                            {fieldErrors.title && <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">{fieldErrors.title}</span>}
                        </div>
                        <input
                            type="text"
                            className={`w-full py-5 text-3xl font-bold border-b transition-all outline-none bg-white placeholder:text-slate-200 ${fieldErrors.title ? 'border-rose-100 text-rose-900 focus:border-rose-400' : 'border-slate-100 text-slate-900 focus:border-slate-900'}`}
                            placeholder="Headline here..."
                            value={formData.title}
                            onFocus={() => fieldErrors.title && setFieldErrors(p => ({ ...p, title: null }))}
                            onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Content</label>
                            <div className="flex gap-4">
                                {fieldErrors.content && <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">{fieldErrors.content}</span>}
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${formData.content.length < 10 ? 'text-rose-300' : 'text-slate-300'}`}>
                                    {formData.content.length} chars
                                </span>
                            </div>
                        </div>
                        <textarea
                            rows="12"
                            className={`w-full py-5 text-lg font-medium border-b transition-all outline-none bg-white leading-relaxed placeholder:text-slate-200 min-h-[300px] resize-none ${fieldErrors.content ? 'border-rose-100 text-rose-900 focus:border-rose-400' : 'border-slate-100 text-slate-800 focus:border-slate-900'}`}
                            placeholder="Tell your story..."
                            value={formData.content}
                            onFocus={() => fieldErrors.content && setFieldErrors(p => ({ ...p, content: null }))}
                            onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 pt-10 border-t border-slate-50">
                    <div className="flex items-center gap-8">
                        <div className="flex flex-col">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Publish Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))}
                                className="bg-transparent text-xs font-bold text-slate-900 border-none outline-none cursor-pointer appearance-none hover:text-slate-500 transition-colors uppercase tracking-widest"
                            >
                                <option value="DRAFT">Private Draft</option>
                                <option value="PUBLISHED">Publicly Published</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] px-6 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`relative bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] py-5 px-12 rounded-full transition-all flex items-center gap-3 shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:shadow-2xl hover:-translate-y-0.5`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                isEditMode ? 'Update Story' : 'Publish Story'
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ArticleForm;
