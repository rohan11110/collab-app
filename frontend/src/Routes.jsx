import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LoginScreen from './pages/login-screen';
import UserProfileSettings from './pages/user-profile-settings';
import DocumentDashboard from './pages/document-dashboard';
import DocumentSharingSettings from './pages/document-sharing-settings';
import RegisterScreen from './pages/register-screen';
import DocumentEditor from './pages/document-editor';
import ProtectedRoute from "./components/ProtectedRoute"; // ✅

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public Routes */}
          <Route path="/login-screen" element={<LoginScreen />} />
          <Route path="/register-screen" element={<RegisterScreen />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DocumentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-profile-settings"
            element={
              <ProtectedRoute>
                <UserProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/document-dashboard"
            element={
              <ProtectedRoute>
                <DocumentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/document-sharing-settings"
            element={
              <ProtectedRoute>
                <DocumentSharingSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/document-editor"
            element={
              <ProtectedRoute>
                <DocumentEditor />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
