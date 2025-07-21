import { NavLink } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  FileText,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  Building2,
  CreditCard,
  UserCheck,
  Folder,
  Clock,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  userType: 'admin' | 'funcionario' | 'cliente';
}

interface NavItem {
  title: string;
  icon: any;
  href: string;
  badge?: number;
  userTypes: ('admin' | 'funcionario' | 'cliente')[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    userTypes: ["admin", "funcionario", "cliente"],
  },
  {
    title: "Clientes",
    icon: Users,
    href: "/clientes",
    userTypes: ["admin", "funcionario"],
  },
  {
    title: "Documentos",
    icon: FileText,
    href: "/documentos",
    badge: 5,
    userTypes: ["admin", "funcionario", "cliente"],
  },
  {
    title: "Tarefas",
    icon: CheckSquare,
    href: "/tarefas",
    badge: 12,
    userTypes: ["admin", "funcionario"],
  },
  {
    title: "Agenda",
    icon: Calendar,
    href: "/agenda",
    userTypes: ["admin", "funcionario"],
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    href: "/relatorios",
    userTypes: ["admin", "funcionario"],
  },
  {
    title: "Meus Documentos",
    icon: Folder,
    href: "/meus-documentos",
    userTypes: ["cliente"],
  },
  {
    title: "Solicitações",
    icon: Clock,
    href: "/solicitacoes",
    userTypes: ["cliente"],
  },
  {
    title: "Financeiro",
    icon: CreditCard,
    href: "/financeiro",
    userTypes: ["admin"],
  },
  {
    title: "MicroSaaS",
    icon: Building2,
    href: "/microsaas",
    userTypes: ["admin"],
  },
  {
    title: "Funcionários",
    icon: UserCheck,
    href: "/funcionarios",
    userTypes: ["admin"],
  },
  {
    title: "Configurações",
    icon: Settings,
    href: "/configuracoes",
    userTypes: ["admin", "funcionario"],
  },
];

export function Sidebar({ isOpen, userType }: SidebarProps) {
  const filteredNavItems = navItems.filter(item => 
    item.userTypes.includes(userType)
  );

  return (
    <aside
      className={`
        glass-card fixed left-0 top-0 z-40 h-screen transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:h-auto md:min-h-screen
        w-64 border-r
      `}
    >
      <div className="p-6 pt-20 md:pt-6">
        {/* Logo para Desktop */}
        <div className="hidden md:flex items-center gap-3 mb-8">
          <div className="gradient-primary p-2 rounded-lg">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">PRIMAR</h1>
            <p className="text-xs text-muted-foreground">Sistema de controle</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
              {item.badge && (
                <Badge 
                  variant="secondary" 
                  className="ml-auto h-5 w-5 flex items-center justify-center text-xs p-0"
                >
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Type Info */}
        <div className="mt-8 p-4 bg-secondary/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Modo de acesso</p>
          <p className="text-sm font-medium capitalize">{userType}</p>
        </div>
      </div>
    </aside>
  );
}