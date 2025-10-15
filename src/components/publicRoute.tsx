import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate } from "react-router-dom";
import { PublicRouteProps } from "../types/interfaces";

function PublicRoute({ children }: PublicRouteProps) {
    const user = useSelector((state: RootState) => state.auth.loggedInUser);

    // Ako je korisnik logovan, preusmeri ga na home ili neku drugu stranicu
    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PublicRoute;
