import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Core layout and context components
import PrivateRoute from './PrivateRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import { CartProvider } from '../modules/customer/context/CartContext';
import LiveOrdersPage from '../modules/orders/pages/LiveOrdersPage';

// Lazy loaded Admin & Auth pages
const LandingPage = lazy(() => import('../pages/LandingPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const AccessDeniedPage = lazy(() => import('../pages/AccessDeniedPage')); // <--- NEW
const SetupWizard = lazy(() => import('../modules/setup/pages/SetupWizard'));
const DashboardPage = lazy(() => import('../modules/dashboard/pages/DashboardPage'));
const ProfilePage = lazy(() => import('../modules/dashboard/pages/ProfilePage'));
const MenuMaster = lazy(() => import('../modules/menus/pages/MenuMaster'));
const TablesPage = lazy(() => import('../modules/tables/pages/TablesPage'));
const RolesPage = lazy(() => import('../modules/roles/pages/RolesPage'));
const ItemsPage = lazy(() => import('../modules/items/pages/ItemsPage'));
const BranchesPage = lazy(() => import('../modules/branches/pages/BranchesPage'));
const CategoriesPage = lazy(() => import('../modules/categories/pages/CategoriesPage'));
const AddonsPage = lazy(() => import('../modules/addons/pages/AddonsPage'));
const StaffListPage = lazy(() => import('../modules/staff/pages/StaffListPage'));
const Permissionspage = lazy(() => import('../modules/permissions/pages/PermissionsPage'));
const BillingScreen = lazy(() => import('../modules/billing/pages/BillingScreen'));
const BillingHistoryPage = lazy(() => import('../modules/billing/pages/BillingHistoryPage')); // <--- NEW
const ReportsPage = lazy(() => import('../modules/reports/pages/ReportsPage'));
const FeedbackPage = lazy(() => import('../modules/feedback/pages/FeedbackPage')); // <--- NEW

// Lazy loaded Customer App pages
const MenuPage = lazy(() => import('../modules/customer/pages/MenuPage'));

// A sleek, reusable loading spinner for route transitions
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ACCESS DENIED PAGE */}
        <Route path="/access-denied" element={<AccessDeniedPage />} />

        {/* CUSTOMER APP ROUTE (QR Menu) */}
        <Route 
          path="/menu/:qrToken" 
          element={
            <CartProvider>
              <MenuPage />
            </CartProvider>
          } 
        />

        {/* PROTECTED SAAS ROUTES (Admin/Staff) */}
        <Route element={<PrivateRoute />}>
          
          <Route path="/setup" element={<SetupWizard />} />
          
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/menus" element={<MenuMaster />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/roles" element={<RolesPage />} /> 
            <Route path="/items" element={<ItemsPage />} /> 
            <Route path="/branches" element={<BranchesPage />} /> 
            <Route path="/categories" element={<CategoriesPage />} /> 
            <Route path="/addons" element={<AddonsPage />} /> 
            <Route path="/users" element={<StaffListPage />} /> 
            <Route path="/permission" element={<Permissionspage />} />
            <Route path="/live-orders" element={<LiveOrdersPage/>} />
            <Route path="/billing/:orderId" element={<BillingScreen />} />
            <Route path="/billing-history" element={<BillingHistoryPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
          </Route>
          
        </Route>

        {/* CATCH-ALL ROUTE (404 Handling) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
        
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;