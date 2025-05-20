
import React from 'react'; // Adding explicit React import
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";

// Auth Context
import { AuthProvider } from "./contexts/AuthContext";
import RequireAuth from "./components/auth/RequireAuth";

// Auth pages
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Register from "./pages/Register";

// App pages
import Dashboard from "./pages/Dashboard";
import Vault from "./pages/Vault";
import Generator from "./pages/Generator";
import Security from "./pages/Security";
import Settings from "./pages/Settings";

// Layout
import AppLayout from "./components/layout/AppLayout";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Splash />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route element={
                <RequireAuth>
                  <AppLayout />
                </RequireAuth>
              }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/vault" element={<Vault />} />
                <Route path="/generator" element={<Generator />} />
                <Route path="/security" element={<Security />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              
              {/* Fallback route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
