import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../../pages/login";
import { BlueprintPage } from "../../pages/blueprint";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/blueprint" element={<BlueprintPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
