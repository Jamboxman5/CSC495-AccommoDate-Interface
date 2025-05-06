import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getUserRole } from "../services/auth";

export default function AdminRoute({ children }: { children: ReactNode }) {
    const role = getUserRole();

    if (role != "ROLE_ADMIN") {
        return <Navigate to="/home" replace />;
    }

    return <>{children}</>
}