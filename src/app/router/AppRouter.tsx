import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { LoginPage } from "../../pages/login";
import { BlueprintPage } from "../../pages/blueprint";
import { useAppStore } from "../store";
import { FullscreenLoader } from "../../shared/ui/loader";
import { DashboardPage } from "../../pages/dashboard/ui/DashboardPage";

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
  const { isInitialized } = useAppStore();

  if (!isInitialized) {
    return <FullscreenLoader text="Initializing..." />;
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
