import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Activity, Users, Clock } from 'lucide-react';
import { useBacklogItems } from '@/hooks/useBacklogItems';
import { useProfiles } from '@/hooks/useProfiles';
import { useActivities } from '@/hooks/useActivities';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { items, loading } = useBacklogItems();
  const { profiles } = useProfiles();
  const { data: activities = [] } = useActivities(5);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-2"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const totalItems = items.length;
  const inProgress = items.filter(item => item.status === 'en_proceso').length;
  const completed = items.filter(item => item.status === 'completado').length;
  const highPriority = items.filter(item => ['P1', 'P2'].includes(item.priority)).length;

  const stats = [
    {
      title: 'Total Historias',
      value: totalItems,
      description: 'En el backlog actual',
      icon: Activity,
      color: 'text-primary'
    },
    {
      title: 'En Progreso',
      value: inProgress,
      description: 'Historias activas',
      icon: Clock,
      color: 'text-warning'
    },
    {
      title: 'Completadas',
      value: completed,
      description: 'Este sprint',
      icon: Activity,
      color: 'text-success'
    },
    {
      title: 'Alta Prioridad',
      value: highPriority,
      description: 'P1 y P2',
      icon: Activity,
      color: 'text-destructive'
    },
    {
      title: 'Miembros Activos',
      value: profiles.length,
      description: 'En el equipo',
      icon: Users,
      color: 'text-info'
    },
    {
      title: 'Actividad Reciente',
      value: activities.length,
      description: 'Últimas acciones',
      icon: Activity,
      color: 'text-muted-foreground'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Resumen del Backlog</h1>
          <p className="text-muted-foreground">
            Gestión simplificada de historias de usuario
          </p>
        </div>
        <Button 
          onClick={() => navigate('/backlog')} 
          className="btn-premium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Historia
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="glass-card hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Estados del Backlog</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { status: 'pendiente', label: 'Pendientes', count: items.filter(i => i.status === 'pendiente').length },
              { status: 'en_proceso', label: 'En Proceso', count: inProgress },
              { status: 'qa', label: 'En QA', count: items.filter(i => i.status === 'qa').length },
              { status: 'completado', label: 'Completadas', count: completed },
            ].map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="glass-card min-w-[80px] justify-center">
                    {item.label}
                  </Badge>
                </div>
                <span className="text-lg font-semibold text-foreground">
                  {item.count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Distribución por Prioridad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { priority: 'P1', label: 'Crítica', count: items.filter(i => i.priority === 'P1').length },
              { priority: 'P2', label: 'Alta', count: items.filter(i => i.priority === 'P2').length },
              { priority: 'P3', label: 'Media', count: items.filter(i => i.priority === 'P3').length },
              { priority: 'P4', label: 'Baja', count: items.filter(i => i.priority === 'P4').length },
            ].map((item) => (
              <div key={item.priority} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={item.priority === 'P1' ? 'destructive' : item.priority === 'P2' ? 'default' : 'outline'} 
                    className="min-w-[60px] justify-center"
                  >
                    {item.label}
                  </Badge>
                </div>
                <span className="text-lg font-semibold text-foreground">
                  {item.count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/backlog')}
              className="glass-card"
            >
              Ver Backlog Completo
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/team')}
              className="glass-card"
            >
              Gestionar Equipo
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/settings')}
              className="glass-card"
            >
              Configuración
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}