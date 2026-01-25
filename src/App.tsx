import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import Index from "./pages/Index";
import ServicesPage from "./pages/ServicesPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import BlogPage from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Inquiries from "./pages/admin/Inquiries";
import Analytics from "./pages/admin/Analytics";
import Blogs from "./pages/admin/Blogs";
import BlogEditorPage from "./pages/admin/BlogEditorPage";
import Categories from "./pages/admin/Categories";

const queryClient = new QueryClient();

const AppContent = () => {
  useVisitorTracking();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/services/:serviceId" element={<ServicesPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="categories" element={<Categories />} />
      </Route>
      <Route
        path="/admin/blogs/new"
        element={
          <ProtectedRoute requireAdmin>
            <BlogEditorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/blogs/:id"
        element={
          <ProtectedRoute requireAdmin>
            <BlogEditorPage />
          </ProtectedRoute>
        }
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
