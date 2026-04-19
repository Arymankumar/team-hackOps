import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Landing } from "@/pages/Landing";
import { Login } from "@/pages/Login";
import { Signup } from "@/pages/Signup";
import { BillingPage } from "@/pages/dashboard/BillingPage";
import { CartPage } from "@/pages/dashboard/CartPage";
import { CategoriesPage } from "@/pages/dashboard/CategoriesPage";
import { DashboardHome } from "@/pages/dashboard/DashboardHome";
import { DealsPage } from "@/pages/dashboard/DealsPage";
import { HistoryPage } from "@/pages/dashboard/HistoryPage";
import { OrdersPage } from "@/pages/dashboard/OrdersPage";
import { ProductDetail } from "@/pages/dashboard/ProductDetail";
import { ProductExplorer } from "@/pages/dashboard/ProductExplorer";
import { RecommendationsPage } from "@/pages/dashboard/RecommendationsPage";
import { SettingsPage } from "@/pages/dashboard/SettingsPage";
import { WishlistPage } from "@/pages/dashboard/WishlistPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="products" element={<ProductExplorer />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="deals" element={<DealsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
