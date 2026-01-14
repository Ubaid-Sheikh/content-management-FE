import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useArticleStore from '../store/articleStore';

const ArticleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentArticle, createArticle, updateArticle, fetchArticleById, loading } = useArticleStore();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        status: 'DRAFT',
        image: null,
    });
    const [preview, setPreview] = useState(null);

    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            fetchArticleById(id);
        } else {
            setFormData({ title: '', content: '', status: 'DRAFT', image: null });
            setPreview(null);
        }
    }, [id, isEditMode, fetchArticleById]);

    useEffect(() => {
        if (isEditMode && currentArticle && currentArticle.id === id) {
            setFormData({
                title: currentArticle.title,
                content: currentArticle.content,
                status: currentArticle.status,
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
            setFormData({ ...formData, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            // IMPORTANT: Append text fields BEFORE the file to ensure Multer populates req.body for validation
            data.append('title', formData.title);
            data.append('content', formData.content);
            data.append('status', formData.status);

            if (formData.image) {
                data.append('image', formData.image);
            }

            if (isEditMode) {
                await updateArticle(id, data);
                toast.success('Updated successfully');
            } else {
                await createArticle(data);
                toast.success('Published successfully');
            }
            navigate('/');
        } catch (error) {
            if (error.response?.data?.errors) {
                // Handle Zod validation errors
                error.response.data.errors.forEach(err => {
                    toast.error(`${err.field}: ${err.message}`);
                });
            } else {
                toast.error(error.response?.data?.message || 'Failed to save');
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-20 fade-in bg-white">
            <div className="mb-16">
                <Link to="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors mb-8 inline-block italic">
                    ← Discard Draft
                </Link>
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight mt-4">
                    {isEditMode ? 'Edit Story' : 'New Story'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12 bg-white">
                <div className="space-y-8">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Cover Image</label>
                        <div className="relative group">
                            <div className={`w-full aspect-[21/9] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-center overflow-hidden transition-all group-hover:border-slate-200 ${preview ? 'border-none' : ''}`}>
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center">
                                        <svg className="mx-auto h-8 w-8 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="mt-2 block text-[10px] font-black uppercase tracking-widest text-slate-300">Choose Image</span>
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
                                    onClick={() => { setPreview(null); setFormData({ ...formData, image: null }); }}
                                    className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <svg className="w-4 h-4 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Title</label>
                        <input
                            type="text"
                            className="w-full py-4 text-3xl font-bold border-b border-slate-100 focus:border-slate-900 transition-all outline-none bg-white text-slate-900 placeholder:text-slate-200"
                            placeholder="Type headline..."
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Content</label>
                            <span className={`text-[10px] font-bold ${formData.content.length < 10 ? 'text-rose-400' : 'text-slate-300'}`}>
                                {formData.content.length} / 10 min
                            </span>
                        </div>
                        <textarea
                            rows="15"
                            className="w-full py-4 text-lg font-medium border-b border-slate-100 focus:border-slate-900 transition-all outline-none bg-white text-slate-800 leading-relaxed placeholder:text-slate-200 min-h-[400px]"
                            placeholder="Start your story..."
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 pt-8">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Visibility</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="bg-white text-xs font-bold text-slate-900 border-none outline-none cursor-pointer appearance-none hover:text-slate-500 transition-colors"
                            >
                                <option value="DRAFT">Private Draft</option>
                                <option value="PUBLISHED">Public Article</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] py-4 px-10 rounded-full transition-all active:scale-95 disabled:opacity-20"
                    >
                        {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Publish Story')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ArticleForm;
