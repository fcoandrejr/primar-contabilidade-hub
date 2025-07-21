import { useState, ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";

interface LayoutProps {
  children: ReactNode;
  companyName?: string;
}

export function Layout({ 
  children, 
  companyName = 'Escritório Contábil ABC'
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userRole } = useAuth();
  
  const userType = userRole || "cliente";

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <Header 
        onMenuClick={toggleSidebar}
        companyName={companyName}
      />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} userType={userType} />
        
        <main className="flex-1 md:ml-0 min-h-screen">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}