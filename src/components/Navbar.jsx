import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-brand">
                        <span className="brand-icon">📝</span>
                        <span className="brand-text">Content Workspace</span>
                    </Link>

                    <div className="navbar-menu">
                        <Link to="/" className="nav-link">
                            Articles
                        </Link>

                        {isAuthenticated ? (
                            <>
                                {(user?.role === 'ADMIN' || user?.role === 'EDITOR') && (
                                    <Link to="/articles/create" className="nav-link">
                                        Create Article
                                    </Link>
                                )}

                                <div className="navbar-user">
                                    <div className="user-info">
                                        <span className="user-name">{user?.name}</span>
                                        <span className={`badge badge-${user?.role?.toLowerCase()}`}>
                                            {user?.role}
                                        </span>
                                    </div>
                                    <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="navbar-actions">
                                <Link to="/login" className="btn btn-secondary btn-sm">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary btn-sm">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
