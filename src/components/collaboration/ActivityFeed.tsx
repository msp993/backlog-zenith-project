import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, FileText, Bug, BarChart3, MessageSquare, Plus, Edit, Trash2 } from 'lucide-react';
import { useActivities } from '@/hooks/useActivities';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ActivityFeedProps {
  limit?: number;
  className?: string;
}

const actionIcons = {
  created: Plus,
  updated: Edit,
  deleted: Trash2,
  commented: MessageSquare,
};

const entityIcons = {
  backlog_item: FileText,
  bug: Bug,
  kpi: BarChart3,
};

const actionColors = {
  created: 'text-success',
  updated: 'text-warning',
  deleted: 'text-destructive', 
  commented: 'text-info',
};

const entityLabels = {
  backlog_item: 'Historia',
  bug: 'Bug',
  kpi: 'KPI',
};

export function ActivityFeed({ limit = 8, className }: ActivityFeedProps) {
  const { data: activities = [], isLoading, error } = useActivities(limit);

  const getUserInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getActionLabel = (action: string) => {
    const labels = {
      created: 'creó',
      updated: 'actualizó',
      deleted: 'eliminó',
      commented: 'comentó en',
    };
    return labels[action as keyof typeof labels] || action;
  };

  if (error) {
    return (
      <Card className={`glass-card ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Activity className="h-4 w-4 text-primary" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-xs text-muted-foreground">Error cargando actividades</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`glass-card ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Activity className="h-4 w-4 text-primary" />
          Actividad Reciente
          <Badge variant="secondary" className="ml-auto">
            {activities.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                  <div className="h-8 w-8 rounded-full bg-muted"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                    <div className="h-2 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-6">
              <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-xs text-muted-foreground">No hay actividades recientes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => {
                const ActionIcon = actionIcons[activity.action_type];
                const EntityIcon = entityIcons[activity.entity_type];
                
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-glass-border"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={activity.user?.avatar_url} 
                          alt={activity.user?.full_name} 
                        />
                        <AvatarFallback className="text-xs bg-gradient-to-r from-purple-400 to-blue-400 text-white">
                          {getUserInitials(activity.user?.full_name, activity.user?.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 p-1 rounded-full bg-background border border-glass-border ${actionColors[activity.action_type]}`}>
                        <ActionIcon className="h-3 w-3" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium text-foreground truncate">
                          {activity.user?.full_name || activity.user?.email || 'Usuario'}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {getActionLabel(activity.action_type)}
                        </span>
                        <EntityIcon className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {entityLabels[activity.entity_type]}
                        </span>
                      </div>
                      
                      <p className="text-xs font-medium text-foreground truncate">
                        {activity.entity_title}
                      </p>
                      
                      {activity.details && (
                        <p className="text-xs text-muted-foreground truncate">
                          {activity.details}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.created_at), { 
                            addSuffix: true,
                            locale: es 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}