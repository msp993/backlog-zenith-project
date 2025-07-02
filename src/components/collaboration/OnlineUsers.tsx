import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Circle } from 'lucide-react';
import { UserPresence } from '@/hooks/useRealtime';

interface OnlineUsersProps {
  users: UserPresence[];
  className?: string;
}

export function OnlineUsers({ users, className }: OnlineUsersProps) {
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'ahora';
    if (diffInMinutes < 60) return `hace ${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `hace ${diffInHours}h`;
    return `hace ${Math.floor(diffInHours / 24)}d`;
  };

  return (
    <Card className={`glass-card ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Users className="h-4 w-4 text-primary" />
          Equipo en línea
          <Badge variant="secondary" className="ml-auto">
            {users.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {users.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-2">
            No hay otros usuarios conectados
          </p>
        ) : (
          users.map((user) => (
            <div
              key={user.user_id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_url} alt={user.user_name} />
                  <AvatarFallback className="text-xs">
                    {user.user_name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 text-success fill-current" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.user_name}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(user.online_at)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  Viendo: {user.page.replace('/', '') || 'dashboard'}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}