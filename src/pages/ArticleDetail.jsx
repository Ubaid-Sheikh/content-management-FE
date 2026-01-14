import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useArticleStore from '../store/articleStore';
import useAuthStore from '../store/authStore';
import './ArticleDetail.css';

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentArticle, loading, fetchArticleById, deleteArticle } = useArticleStore();
    const { user } = useAuthStore();

    useEffect(() => {
        fetchArticleById(id);
    }, [id]);

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
        if (!user || !currentArticle) return false;
        return user.role === 'ADMIN' || currentArticle.author.id === user.id;
    };

    const canDelete = () => {
        return user?.role === 'ADMIN';
    };

    if (loading || !currentArticle) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="article-detail">
                    {/* Header */}
                    <div className="article-detail-header">
                        <div className="article-meta">
                            <span className={`badge badge-${currentArticle.status === 'PUBLISHED' ? 'success' : 'warning'}`}>
                                {currentArticle.status}
                            </span>
                            <span className="article-date">
                                {new Date(currentArticle.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>

                        <h1 className="article-detail-title">{currentArticle.title}</h1>

                        <div className="article-author-section">
                            <div className="author-avatar-large">
                                {currentArticle.author.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="author-info-large">
                                <div className="author-name-large">{currentArticle.author.name}</div>
                                <div className="author-meta">
                                    <span className={`badge badge-${currentArticle.author.role.toLowerCase()}`}>
                                        {currentArticle.author.role}
                                    </span>
                                    <span className="text-muted">{currentArticle.author.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="article-detail-content">
                        <div
                            className="article-body"
                            dangerouslySetInnerHTML={{ __html: currentArticle.content }}
                        />
                    </div>

                    {/* Actions */}
                    {(canEdit() || canDelete()) && (
                        <div className="article-detail-actions">
                            <Link to="/" className="btn btn-secondary">
                                ← Back to Articles
                            </Link>
                            <div className="action-buttons">
                                {canEdit() && (
                                    <Link
                                        to={`/articles/edit/${currentArticle.id}`}
                                        className="btn btn-primary"
                                    >
                                        Edit Article
                                    </Link>
                                )}
                                {canDelete() && (
                                    <button onClick={handleDelete} className="btn btn-danger">
                                        Delete Article
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;
