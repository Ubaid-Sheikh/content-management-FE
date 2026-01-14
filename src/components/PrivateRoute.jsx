import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return (
            <div className="page">
                <div className="container">
                    <div className="card text-center">
                        <h2>Access Denied</h2>
                        <p className="text-muted">
                            You don't have permission to access this page.
                        </p>
                        <p className="text-muted">
                            Required role: {allowedRoles.join(' or ')}
                        </p>
                        <p className="text-muted">Your role: {user?.role}</p>
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default PrivateRoute;
