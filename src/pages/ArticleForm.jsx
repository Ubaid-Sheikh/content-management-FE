import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useArticleStore from '../store/articleStore';
import './ArticleForm.css';

const ArticleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentArticle, createArticle, updateArticle, fetchArticleById, loading } =
        useArticleStore();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        status: 'DRAFT',
    });

    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            fetchArticleById(id);
        }
    }, [id, isEditMode]);

    useEffect(() => {
        if (isEditMode && currentArticle) {
            setFormData({
                title: currentArticle.title,
                content: currentArticle.content,
                status: currentArticle.status,
            });
        }
    }, [currentArticle, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }

        if (!formData.content.trim() || formData.content === '<p><br></p>') {
            toast.error('Content is required');
            return;
        }

        try {
            if (isEditMode) {
                await updateArticle(id, formData);
                toast.success('Article updated successfully');
            } else {
                await createArticle(formData);
                toast.success('Article created successfully');
            }
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['link', 'image'],
            ['clean'],
        ],
    };

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'bullet',
        'color',
        'background',
        'align',
        'link',
        'image',
    ];

    return (
        <div className="page">
            <div className="container">
                <div className="form-container">
                    <div className="form-header">
                        <h1>{isEditMode ? 'Edit Article' : 'Create New Article'}</h1>
                        <p className="text-muted">
                            {isEditMode ? 'Update your article content' : 'Share your thoughts with the world'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="article-form">
                        <div className="form-group">
                            <label htmlFor="title" className="form-label">
                                Article Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                className="form-input"
                                placeholder="Enter a compelling title..."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Content</label>
                            <div className="editor-wrapper">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content}
                                    onChange={(content) => setFormData({ ...formData, content })}
                                    modules={modules}
                                    formats={formats}
                                    placeholder="Start writing your article..."
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="status" className="form-label">
                                Status
                            </label>
                            <select
                                id="status"
                                className="form-select"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="DRAFT">Draft</option>
                                <option value="PUBLISHED">Published</option>
                            </select>
                            <small className="text-muted">
                                {formData.status === 'DRAFT'
                                    ? 'Save as draft to continue editing later'
                                    : 'Publish to make it visible to everyone'}
                            </small>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/')}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading
                                    ? 'Saving...'
                                    : isEditMode
                                        ? 'Update Article'
                                        : 'Create Article'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ArticleForm;
