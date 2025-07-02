import { Button } from '@/components/ui/button';
import { Menu, Bell, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Search */}
        <div className="relative w-96 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar historias, bugs, KPIs..."
            className="pl-10 glass-card border-glass-border"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        {/* Quick actions */}
        <Button size="sm" className="btn-premium">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Historia
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive"></span>
        </Button>

        {/* User avatar */}
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 cursor-pointer"></div>
      </div>
    </header>
  );
}