import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/documentos" element={<Dashboard />} />
          <Route path="/tarefas" element={<Dashboard />} />
          <Route path="/agenda" element={<Dashboard />} />
          <Route path="/relatorios" element={<Dashboard />} />
          <Route path="/meus-documentos" element={<Dashboard />} />
          <Route path="/solicitacoes" element={<Dashboard />} />
          <Route path="/financeiro" element={<Dashboard />} />
          <Route path="/microsaas" element={<Dashboard />} />
          <Route path="/funcionarios" element={<Dashboard />} />
          <Route path="/configuracoes" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
