import { Routes, Route } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardPage } from "./pages/DashboardPage";
import { ItemsPage } from "./pages/ItemsPage";
import { ItemDetailPage } from "./pages/ItemDetailPage";
import { ClaimsPage } from "./pages/ClaimsPage";
import { UsersPage } from "./pages/UsersPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ReportItemPage } from "./pages/ReportItemPage";

/**
 * App — route table only (all UI logic lives in pages).
 */
function App() {
  return (
    <Routes>
      {/* Public login route (no layout nav) */}
      <Route path="/login" element={<LoginPage />} />

      {/* All other routes share the Layout (nav + footer) */}
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route index element={<DashboardPage />} />
        <Route path="items" element={<ItemsPage />} />
        <Route path="items/new" element={<ReportItemPage />} />
        <Route path="items/:itemId" element={<ItemDetailPage />} />

        {/* Protected routes — require auth token */}
        <Route element={<ProtectedRoute />}>
          <Route path="claims" element={<ClaimsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        {/* Catch-all — no URL gives a blank page */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
