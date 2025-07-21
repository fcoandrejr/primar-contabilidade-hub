import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Menu, User, Settings, LogOut, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
  companyName?: string;
}

export function Header({ onMenuClick, companyName }: HeaderProps) {
  const [notifications] = useState(3);
  const { profile, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  const userName = profile?.nome || "Usuário";
  const userType = userRole || "cliente";

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'admin': return 'Administrador';
      case 'funcionario': return 'Funcionário';
      case 'cliente': return 'Cliente';
      default: return '';
    }
  };

  const getUserTypeBadgeVariant = () => {
    switch (userType) {
      case 'admin': return 'default';
      case 'funcionario': return 'secondary';
      case 'cliente': return 'outline';
      default: return 'default';
    }
  };

  return (
    <header className="glass-nav sticky top-0 z-50 w-full px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo e Menu */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="gradient-primary p-2 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">PRIMAR</h1>
              <p className="text-xs text-muted-foreground">Sistema de controle</p>
            </div>
          </div>
        </div>

        {/* Centro - Nome da empresa para clientes */}
        {userType === 'cliente' && companyName && (
          <div className="hidden md:block">
            <p className="text-sm text-muted-foreground">Conectado à</p>
            <p className="font-semibold text-foreground">{companyName}</p>
          </div>
        )}

        {/* Direita - Notificações e User Menu */}
        <div className="flex items-center gap-4">
          {/* Notificações */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
              >
                {notifications}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{userName}</p>
                  <Badge variant={getUserTypeBadgeVariant()} className="text-xs">
                    {getUserTypeLabel()}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Meu Perfil
              </DropdownMenuItem>
              {(userType === 'admin' || userType === 'funcionario') && (
                <>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}