import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingScreen from "../ui/LoadingScreen";

function ProtectedRoute() {
    const { user, isLoading } = useAuth();
    
    
    if (isLoading) return <LoadingScreen/>;
    if (!user) return <Navigate to="/login" replace />;

    return <Outlet />;
}

export default ProtectedRoute;
