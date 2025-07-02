import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-secondary/20 pointer-events-none" />
      
      <div className="relative flex h-screen w-full">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          
          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}