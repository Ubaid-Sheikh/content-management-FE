import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useArticleStore from '../store/articleStore';
import useAuthStore from '../store/authStore';
import './ArticleList.css';

const ArticleList = () => {
    const { articles, pagination, loading, fetchArticles, deleteArticle } = useArticleStore();
    const { user } = useAuthStore();
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: '',
        search: '',
    });

    useEffect(() => {
        fetchArticles(filters);
    }, [filters.page, filters.status]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchArticles(filters);
    };

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

    const canEdit = (article) => {
        if (!user) return false;
        return user.role === 'ADMIN' || article.author.id === user.id;
    };

    const canDelete = () => {
        return user?.role === 'ADMIN';
    };

    if (loading && articles.length === 0) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1>Articles</h1>
                        <p className="text-muted">Explore our content library</p>
                    </div>
                    {(user?.role === 'ADMIN' || user?.role === 'EDITOR') && (
                        <Link to="/articles/create" className="btn btn-primary">
                            ✨ Create Article
                        </Link>
                    )}
                </div>

                {/* Filters */}
                <div className="filters-section">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search articles..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                        <button type="submit" className="btn btn-primary">
                            Search
                        </button>
                    </form>

                    <select
                        className="form-select"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                    >
                        <option value="">All Status</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Draft</option>
                    </select>
                </div>

                {/* Articles Grid */}
                {articles.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📄</div>
                        <h3>No articles found</h3>
                        <p className="text-muted">
                            {filters.search || filters.status
                                ? 'Try adjusting your filters'
                                : 'Be the first to create an article!'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="articles-grid">
                            {articles.map((article) => (
                                <div key={article.id} className="article-card">
                                    <div className="article-header">
                                        <span className={`badge badge-${article.status === 'PUBLISHED' ? 'success' : 'warning'}`}>
                                            {article.status}
                                        </span>
                                        <span className="article-date">
                                            {new Date(article.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <Link to={`/articles/${article.id}`} className="article-title-link">
                                        <h3 className="article-title">{article.title}</h3>
                                    </Link>

                                    <div
                                        className="article-excerpt"
                                        dangerouslySetInnerHTML={{
                                            __html: article.content.substring(0, 150) + '...',
                                        }}
                                    />

                                    <div className="article-footer">
                                        <div className="article-author">
                                            <div className="author-avatar">
                                                {article.author.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="author-name">{article.author.name}</div>
                                                <div className="author-role">
                                                    <span className={`badge badge-${article.author.role.toLowerCase()}`}>
                                                        {article.author.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="article-actions">
                                            {canEdit(article) && (
                                                <Link
                                                    to={`/articles/edit/${article.id}`}
                                                    className="btn btn-secondary btn-sm"
                                                >
                                                    Edit
                                                </Link>
                                            )}
                                            {canDelete() && (
                                                <button
                                                    onClick={() => handleDelete(article.id)}
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                                    disabled={filters.page === 1}
                                >
                                    Previous
                                </button>

                                <span className="pagination-info">
                                    Page {pagination.page} of {pagination.totalPages}
                                </span>

                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                                    disabled={filters.page === pagination.totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ArticleList;
