import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ListTodo, 
  Bug, 
  BarChart3, 
  Users, 
  Settings 
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Backlog', href: '/backlog', icon: ListTodo },
  { name: 'Bugs', href: '/bugs', icon: Bug },
  { name: 'KPIs', href: '/kpis', icon: BarChart3 },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ open, onToggle }: SidebarProps) {
  return (
    <div className={cn(
      "relative flex h-full flex-col border-r border-border bg-background transition-all duration-300",
      open ? "w-64" : "w-16"
    )}>
      {/* Logo area */}
      <div className="flex h-16 items-center px-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          {open && (
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-foreground">ProductFlow</h1>
              <p className="text-xs text-muted-foreground">Backlog Manager</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                "hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className={cn("h-5 w-5", open ? "mr-3" : "mx-auto")} />
            {open && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"></div>
          {open && (
            <div className="flex flex-col">
              <p className="text-sm font-medium text-foreground">Usuario</p>
              <p className="text-xs text-muted-foreground">Product Manager</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}