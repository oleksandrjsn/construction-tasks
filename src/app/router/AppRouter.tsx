import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { BlueprintPage } from "../../pages/blueprint";
import { DashboardPage } from "../../pages/dashboard/ui/DashboardPage";
import { LoginPage } from "../../pages/login";
import { useAppStore } from "../store";

const AUTH_ROUTES = ["/login"];

function AppRoutes() {
  const { isLoggedIn } = useAppStore();
  const location = useLocation();

  const shouldNavigateToLogin = !isLoggedIn && location.pathname !== "/login";
  const shouldNavigateToBlueprint =
    (isLoggedIn && AUTH_ROUTES.includes(location.pathname)) ||
    location.pathname === "/";

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/blueprint" element={<BlueprintPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/"
          element={
            <Navigate to={isLoggedIn ? "/blueprint" : "/login"} replace />
          }
        />
      </Routes>
      {shouldNavigateToLogin && <Navigate to="/login" replace />}
      {shouldNavigateToBlueprint && <Navigate to="/blueprint" replace />}
    </>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
