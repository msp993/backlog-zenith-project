import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CollaborationSidebar } from '../collaboration/CollaborationSidebar';
import { useRealtime } from '@/hooks/useRealtime';
import { useAuth } from '@/contexts/AuthContext';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();
  const { onlineUsers } = useRealtime("backlog_items", user?.id);

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
          
          {/* Page content with collaboration sidebar */}
          <main className="flex-1 overflow-y-auto">
            <div className="flex h-full">
              <div className="flex-1 p-6">
                <div className="mx-auto max-w-6xl">
                  <Outlet />
                </div>
              </div>
              <div className="w-80 p-4 border-l border-border bg-muted/20">
                <CollaborationSidebar onlineUsers={onlineUsers} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}