import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Activity, Plus, Edit, Trash2, MessageSquare, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ActivityItem {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  action: 'created' | 'updated' | 'deleted' | 'commented' | 'viewed';
  entity_type: 'backlog_item' | 'bug' | 'kpi';
  entity_id: string;
  entity_title: string;
  timestamp: string;
  details?: string;
}

interface ActivityFeedProps {
  className?: string;
  limit?: number;
}

const actionIcons = {
  created: Plus,
  updated: Edit,
  deleted: Trash2,
  commented: MessageSquare,
  viewed: Eye
};

const actionColors = {
  created: 'bg-success text-success-foreground',
  updated: 'bg-primary text-primary-foreground',
  deleted: 'bg-destructive text-destructive-foreground',
  commented: 'bg-info text-info-foreground',
  viewed: 'bg-muted text-muted-foreground'
};

const actionLabels = {
  created: 'creó',
  updated: 'actualizó',
  deleted: 'eliminó',
  commented: 'comentó en',
  viewed: 'vió'
};

export function ActivityFeed({ className, limit = 10 }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Mock data - in real app, this would come from Supabase
  useEffect(() => {
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        user_id: 'user1',
        user_name: 'Ana García',
        action: 'created',
        entity_type: 'backlog_item',
        entity_id: 'item1',
        entity_title: 'Implementar autenticación',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
      },
      {
        id: '2',
        user_id: 'user2',
        user_name: 'Carlos López',
        action: 'updated',
        entity_type: 'bug',
        entity_id: 'bug1',
        entity_title: 'Error en validación de formulario',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
        details: 'Cambió estado a "En Proceso"'
      },
      {
        id: '3',
        user_id: 'user3',
        user_name: 'María Rodriguez',
        action: 'commented',
        entity_type: 'backlog_item',
        entity_id: 'item2',
        entity_title: 'Dashboard de métricas',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
        details: 'Necesitamos revisar los requisitos de UX'
      },
      {
        id: '4',
        user_id: 'user1',
        user_name: 'Ana García',
        action: 'updated',
        entity_type: 'kpi',
        entity_id: 'kpi1',
        entity_title: 'Tasa de conversión',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        details: 'Actualizó valor objetivo'
      },
      {
        id: '5',
        user_id: 'user4',
        user_name: 'David Silva',
        action: 'created',
        entity_type: 'bug',
        entity_id: 'bug2',
        entity_title: 'Problema de performance en carga',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
      }
    ];

    setActivities(mockActivities.slice(0, limit));
  }, [limit]);

  return (
    <Card className={`glass-card ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Activity className="h-4 w-4 text-primary" />
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = actionIcons[activity.action];
              
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.user_avatar} alt={activity.user_name} />
                      <AvatarFallback className="text-xs">
                        {activity.user_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 rounded-full p-1 ${actionColors[activity.action]}`}>
                      <Icon className="h-2.5 w-2.5" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-foreground">
                      <span className="font-medium">{activity.user_name}</span>
                      {' '}
                      <span className="text-muted-foreground">
                        {actionLabels[activity.action]}
                      </span>
                      {' '}
                      <span className="font-medium">{activity.entity_title}</span>
                    </div>
                    
                    {activity.details && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.details}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        {activity.entity_type.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.timestamp), {
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
}