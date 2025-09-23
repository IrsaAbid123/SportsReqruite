import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import VerifyOtp from "./pages/Auth/VerifyOtp";
import ResetPassword from "./pages/Auth/ResetPassword";
import CreatePost from "./pages/PostCreation/CreatePost";
import ProfilePage from "./pages/Profile/Profile";
import { Header } from "./components/Header";
import { MainLayout } from "./Layout";
import { useEffect, useState } from "react";
import { AuthForm } from "./components/AuthForm";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ChatPage } from "./pages/Chat/ChatPage";
import { useUser } from "./context/UserContext";
import { UserForm } from "./pages/Dashboard/UserForm";
import { PostForm } from "./pages/Dashboard/PostForm";
import Dashboard from "./pages/Dashboard/index";

const queryClient = new QueryClient();

const App = () => {
  const { user, setUser } = useUser();
  const isAuthenticated = !!user;

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/signin"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <AuthForm />
                )
              }
            />
            {/* Auth Routes */}
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<Index />} />
            {/* <Route path="/chat" element={<ChatPage />} /> */}

            {/* Protected Routes */}
            <Route element={<MainLayout onLogout={handleLogout} />}>
              <Route
                path="/create-post"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <CreatePost />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-profile"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/users/:id"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <UserForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/posts/:id"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <PostForm />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
