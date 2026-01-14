import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useArticleStore from '../store/articleStore';
import useAuthStore from '../store/authStore';

const ArticleList = () => {
    const { articles, fetchArticles, deleteArticle, pagination, loading } = useArticleStore();
    const { user, isAuthenticated } = useAuthStore();
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetchArticles({ search, status, page: 1 });
    }, [fetchArticles, search, status]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            try {
                await deleteArticle(id);
                toast.success('Article deleted successfully');
            } catch (error) {
                toast.error('Failed to delete article');
            }
        }
    };

    const handlePageChange = (newPage) => {
        fetchArticles({ search, status, page: newPage });
    };

    const canEdit = (article) => {
        if (!isAuthenticated) return false;
        if (user.role === 'ADMIN') return true;
        return user.role === 'EDITOR' && article.authorId === user.id;
    };

    const canDelete = () => {
        return isAuthenticated && user.role === 'ADMIN';
    };

    const truncate = (str, n) => {
        return str?.length > n ? str.substr(0, n - 1) + '...' : str;
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-16 fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Feed</h1>
                    <p className="text-slate-400 font-medium">Insights and updates from across the workspace.</p>
                </div>

                {isAuthenticated && (user.role === 'ADMIN' || user.role === 'EDITOR') && (
                    <Link
                        to="/articles/create"
                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white font-bold py-2.5 px-6 rounded-full transition-all active:scale-95 text-sm"
                    >
                        Create Story
                    </Link>
                )}
            </div>

            {/* Pure White Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search workspace..."
                        className="w-full px-4 py-2.5 bg-white border-b border-slate-200 focus:border-slate-900 outline-none transition-all text-sm placeholder:text-slate-300"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-2.5 bg-white border-b border-slate-200 focus:border-slate-900 outline-none transition-all text-sm cursor-pointer font-bold text-slate-600"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                </select>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {[1, 2, 3].map((idx) => (
                        <div key={idx} className="animate-pulse">
                            <div className="h-6 bg-slate-100 rounded-full w-3/4 mb-4"></div>
                            <div className="h-4 bg-slate-50 rounded-full w-full mb-2"></div>
                            <div className="h-4 bg-slate-50 rounded-full w-5/6 mb-6"></div>
                            <div className="h-8 bg-slate-50 rounded-full w-1/3"></div>
                        </div>
                    ))}
                </div>
            ) : articles.length === 0 ? (
                <div className="text-center py-20 bg-white">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Workspace is quiet</h3>
                    <p className="text-slate-400">Try adjusting your filters or start writing.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 mb-20">
                        {articles.map((article) => (
                            <div key={article.id} className="group relative flex flex-col items-start bg-white">
                                <Link to={`/articles/${article.id}`} className="block mb-4 overflow-hidden rounded-2xl w-full aspect-[16/10] bg-slate-100">
                                    <img
                                        src={article.imageUrl || `https://picsum.photos/seed/${article.id}/800/600`}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => {
                                            e.target.src = `https://picsum.photos/seed/${article.id}/800/600`;
                                        }}
                                    />
                                </Link>

                                <div className="flex items-center gap-3 mb-3">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${article.status === 'PUBLISHED' ? 'border-green-200 text-green-600' : 'border-amber-200 text-amber-600'
                                        }`}>
                                        {article.status}
                                    </span>
                                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                        {new Date(article.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>

                                <Link to={`/articles/${article.id}`} className="block group-hover:text-slate-600 transition-colors mb-3">
                                    <h2 className="text-xl font-bold text-slate-900 leading-tight">
                                        {article.title}
                                    </h2>
                                </Link>

                                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6 font-medium">
                                    {truncate(article.content, 100)}
                                </p>

                                <div className="mt-auto flex items-center justify-between w-full pt-4 border-t border-slate-100">
                                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{article.author?.name}</span>

                                    <div className="flex items-center gap-1">
                                        {canEdit(article) && (
                                            <Link to={`/articles/edit/${article.id}`} className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </Link>
                                        )}
                                        {canDelete() && (
                                            <button onClick={() => handleDelete(article.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v2m3 4h.01" /></svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Minimal Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-8 border-t border-slate-100 pt-12">
                            <button
                                disabled={pagination.page === 1}
                                onClick={() => handlePageChange(pagination.page - 1)}
                                className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 disabled:opacity-20 transition-colors"
                            >
                                Previous
                            </button>
                            <span className="text-xs font-black text-slate-900">
                                {pagination.page} / {pagination.totalPages}
                            </span>
                            <button
                                disabled={pagination.page === pagination.totalPages}
                                onClick={() => handlePageChange(pagination.page + 1)}
                                className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 disabled:opacity-20 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ArticleList;
