import { useState, ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
  userType?: 'admin' | 'funcionario' | 'cliente';
  userName?: string;
  companyName?: string;
}

export function Layout({ 
  children, 
  userType = 'admin', 
  userName = 'João Silva',
  companyName = 'Escritório Contábil ABC'
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <Header 
        onMenuClick={toggleSidebar}
        userType={userType}
        userName={userName}
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