import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Financeiro from "./pages/Financeiro";
import Funcionarios from "./pages/Funcionarios";
import Tarefas from "./pages/Tarefas";
import Documentos from "./pages/Documentos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
            <Route path="/documentos" element={<ProtectedRoute><Documentos /></ProtectedRoute>} />
            <Route path="/tarefas" element={<ProtectedRoute><Tarefas /></ProtectedRoute>} />
            <Route path="/agenda" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/relatorios" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/meus-documentos" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/solicitacoes" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/financeiro" element={<ProtectedRoute><Financeiro /></ProtectedRoute>} />
            <Route path="/microsaas" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/funcionarios" element={<ProtectedRoute><Funcionarios /></ProtectedRoute>} />
            <Route path="/configuracoes" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
