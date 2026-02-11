import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ChatPage } from "./pages/ChatPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useSignalR } from "./hooks/useSignalR";
import { APP_ROUTES } from "./constants/routes";

function App() {
  useSignalR();

  return (
    <Routes>
      <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />
      <Route
        path={APP_ROUTES.CHAT}
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={APP_ROUTES.ROOT}
        element={<Navigate to={APP_ROUTES.LOGIN} replace />}
      />
    </Routes>
  );
}

export default App;
