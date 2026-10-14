import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import api from "../config/axios"
export interface NavbarModule {
  route_path: string;
  sub_modules?: NavbarModule[];
}

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  
  // State to hold allowed paths array
  const [allowedRoutes, setAllowedRoutes] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchPermissions = async () => {
      try {
        const res = await api.get("/permissions/my-navbar", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data?.status === "success") {
          // Always allow dashboard, setup, and billing by default for authenticated users
          const routes: string[] = ['/dashboard', '/setup', '/billing']; 

          // Recursive function to extract all valid route_paths
          const extractRoutes = (items: NavbarModule[]) => {
            items.forEach(item => {
              if (item.route_path && item.route_path !== '#') {
                routes.push(item.route_path);
              }
              if (item.sub_modules && item.sub_modules.length > 0) {
                extractRoutes(item.sub_modules);
              }
            });
          };

          extractRoutes(res.data.data);
          setAllowedRoutes(routes);
        } else {
          setAllowedRoutes([]); // Fallback to empty if API fails
        }
      } catch (error) {
        console.error("Failed to fetch permissions", error);
        setAllowedRoutes([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch once when the component mounts
    if (allowedRoutes === null) {
      fetchPermissions();
    }
  }, [token]);

  // 1. Check Authentication
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. Show loader while validating permissions
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // 3. Check Authorization (RBAC)
  // Check if current path EXACTLY matches or STARTS WITH an allowed route (e.g., /items/123)
  const hasAccess = allowedRoutes?.some(route => 
    location.pathname === route || location.pathname.startsWith(`${route}/`)
  );

  if (!hasAccess) {
    return <Navigate to="/access-denied" replace />;
  }

  // 4. Authorized! Render the Dashboard/Module
  return <Outlet />;
};

export default PrivateRoute;