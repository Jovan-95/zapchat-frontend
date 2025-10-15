import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { PrivateRouteProps } from "../types/interfaces";

function PrivateRoute({ children }: PrivateRouteProps) {
    const user = useSelector((state: RootState) => state.auth.loggedInUser);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default PrivateRoute;
