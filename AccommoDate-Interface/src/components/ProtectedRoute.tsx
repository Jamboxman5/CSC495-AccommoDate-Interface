import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../services/auth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const token = getToken();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>
}