import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulação de login - remover quando conectar ao Supabase
    setTimeout(() => {
      setLoading(false);
      
      // Simulação de diferentes tipos de usuário baseado no email
      if (formData.email.includes("admin")) {
        localStorage.setItem("userType", "admin");
        localStorage.setItem("userName", "João Silva");
      } else if (formData.email.includes("funcionario")) {
        localStorage.setItem("userType", "funcionario");
        localStorage.setItem("userName", "Maria Santos");
      } else {
        localStorage.setItem("userType", "cliente");
        localStorage.setItem("userName", "Carlos Oliveira");
      }

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao Sistema Primar.",
      });

      navigate("/dashboard");
    }, 1500);
  };

  const handleDemoLogin = (userType: 'admin' | 'funcionario' | 'cliente') => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("userType", userType);
      
      const demoUsers = {
        admin: "João Silva (Admin)",
        funcionario: "Maria Santos (Funcionário)",
        cliente: "Carlos Oliveira (Cliente)"
      };
      
      localStorage.setItem("userName", demoUsers[userType]);
      
      toast({
        title: "Login demo realizado!",
        description: `Conectado como ${demoUsers[userType]}`,
      });

      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="w-full max-w-md space-y-6">
        {/* Logo e Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">PRIMAR</h1>
            <p className="text-muted-foreground">Sistema de controle</p>
          </div>
        </div>

        {/* Card de Login */}
        <Card className="glass-card animate-fade-in">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center">Entrar no Sistema</CardTitle>
            <CardDescription className="text-center">
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full gradient-primary" 
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            {/* Login Demo */}
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Ou teste o sistema:</p>
              </div>
              
              <div className="grid gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => handleDemoLogin('admin')}
                  disabled={loading}
                >
                  <span>Login como Administrador</span>
                  <Badge variant="default">Admin</Badge>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => handleDemoLogin('funcionario')}
                  disabled={loading}
                >
                  <span>Login como Funcionário</span>
                  <Badge variant="secondary">Staff</Badge>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => handleDemoLogin('cliente')}
                  disabled={loading}
                >
                  <span>Login como Cliente</span>
                  <Badge variant="outline">Cliente</Badge>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Sistema Primar Contabilidade © 2025</p>
          <p>Solução completa para escritórios contábeis</p>
        </div>
      </div>
    </div>
  );
}