import { Routes, Route } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardPage } from "./pages/DashboardPage";
import { ItemsPage } from "./pages/ItemsPage";
import { ItemDetailPage } from "./pages/ItemDetailPage";
import { ClaimsPage } from "./pages/ClaimsPage";
import { UsersPage } from "./pages/UsersPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ReportItemPage } from "./pages/ReportItemPage";
import { ReviewPage } from "./pages/ReviewPage";
import { UserRole } from "./types/index";

/**
 * App — route table only (all UI logic lives in pages).
 */
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="items" element={<ItemsPage />} />
        <Route path="items/:itemId" element={<ItemDetailPage />} />
        <Route path="login" element={<LoginPage />} />
        {/* Public, like login: you cannot be logged in yet. */}
        <Route path="register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="items/new" element={<ReportItemPage />} />
          {/* Session 11: behind the same guard -- the API refuses it
              without a token anyway, so the page should not offer it. */}
          <Route path="review" element={<ReviewPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[UserRole.Admin]} />}>
          <Route path="claims" element={<ClaimsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
