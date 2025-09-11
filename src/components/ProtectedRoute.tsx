import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, isAuthenticated }: { children: JSX.Element, isAuthenticated: boolean }) => {
    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }
    return children;
};
