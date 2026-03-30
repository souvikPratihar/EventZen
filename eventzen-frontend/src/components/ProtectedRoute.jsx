import { Navigate } from 'react-router-dom';
import { isLoggedIn, getUserRole } from '../services/authService';

function ProtectedRoute({ children, allowedRoles = [] }) {
    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0) {
        const role = getUserRole();

        if (!allowedRoles.includes(role)) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
}

export default ProtectedRoute;