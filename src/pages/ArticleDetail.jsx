import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useArticleStore from '../store/articleStore';
import useAuthStore from '../store/authStore';

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentArticle, fetchArticleById, deleteArticle, loading } = useArticleStore();
    const { user, isAuthenticated } = useAuthStore();

    useEffect(() => {
        fetchArticleById(id);
    }, [id, fetchArticleById]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            try {
                await deleteArticle(id);
                toast.success('Article deleted successfully');
                navigate('/');
            } catch (error) {
                toast.error('Failed to delete article');
            }
        }
    };

    const canEdit = () => {
        if (!isAuthenticated || !currentArticle) return false;
        if (user.role === 'ADMIN') return true;
        return user.role === 'EDITOR' && currentArticle.authorId === user.id;
    };

    const canDelete = () => {
        return isAuthenticated && user.role === 'ADMIN';
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 fade-in animate-pulse">
                <div className="h-10 bg-slate-50 rounded-full w-full mb-12"></div>
                <div className="space-y-4">
                    <div className="h-4 bg-slate-50 rounded-full w-full"></div>
                    <div className="h-4 bg-slate-50 rounded-full w-5/6"></div>
                    <div className="h-4 bg-slate-50 rounded-full w-full"></div>
                </div>
            </div>
        );
    }

    if (!currentArticle) {
        return (
            <div className="text-center py-40 bg-white">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Article not found</h2>
                <Link to="/" className="text-slate-500 font-bold hover:text-slate-900 underline underline-offset-4 transition-colors">Return to Feed</Link>
            </div>
        );
    }

    return (
        <article className="max-w-2xl mx-auto px-4 py-20 fade-in bg-white">
            <header className="mb-20">
                <div className="flex items-center gap-4 mb-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {new Date(currentArticle.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${currentArticle.status === 'PUBLISHED' ? 'text-green-500' : 'text-amber-500'
                        }`}>
                        {currentArticle.status}
                    </span>
                </div>

                <h1 className="text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-12">
                    {currentArticle.title}
                </h1>

                {currentArticle.imageUrl && (
                    <div className="w-full aspect-video rounded-3xl overflow-hidden mb-12 bg-slate-50">
                        <img
                            src={currentArticle.imageUrl}
                            alt={currentArticle.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="flex items-center justify-between py-6 border-y border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-[11px] font-black text-white uppercase tracking-tighter">
                            {currentArticle.author?.name?.substring(0, 2)}
                        </div>
                        <div>
                            <div className="text-slate-900 font-bold text-sm tracking-tight">{currentArticle.author?.name}</div>
                            <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">{currentArticle.author?.role}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {canEdit() && (
                            <Link
                                to={`/articles/edit/${currentArticle.id}`}
                                className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                Edit
                            </Link>
                        )}
                        {canDelete() && (
                            <button
                                onClick={handleDelete}
                                className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div className="prose prose-slate max-w-none">
                <div className="text-slate-800 leading-[1.8] space-y-8 text-lg font-medium whitespace-pre-wrap">
                    {currentArticle.content}
                </div>
            </div>

            <footer className="mt-24 pt-12 border-t border-slate-100 italic text-slate-400 text-sm">
                Thanks for reading. Back to the <Link to="/" className="text-slate-900 font-bold not-italic hover:underline">Workspace Feed</Link>.
            </footer>
        </article>
    );
};

export default ArticleDetail;
