import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Resumen general del proyecto</p>
        </div>
        <Badge variant="outline" className="glass-card">
          Último sync: hace 2 min
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Historias Activas
            </CardTitle>
            <ListTodo className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">23</div>
            <p className="text-xs text-success">
              <TrendingUp className="mr-1 inline h-3 w-3" />
              +12% desde la semana pasada
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bugs Abiertos
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">8</div>
            <p className="text-xs text-destructive">
              +2 bugs críticos
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Velocidad Sprint
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">42</div>
            <p className="text-xs text-muted-foreground">
              story points completados
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Team Members
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">8</div>
            <p className="text-xs text-success">
              6 activos hoy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Actividad Reciente</span>
            </CardTitle>
            <CardDescription>
              Últimas actualizaciones del equipo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 rounded-full bg-success mt-2"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">María</span> completó la historia{' '}
                  <span className="font-medium">"Implementar login OAuth"</span>
                </p>
                <p className="text-xs text-muted-foreground">hace 15 minutos</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 rounded-full bg-warning mt-2"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Carlos</span> reportó un bug crítico en{' '}
                  <span className="font-medium">"Sistema de pagos"</span>
                </p>
                <p className="text-xs text-muted-foreground">hace 1 hora</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Ana</span> actualizó la prioridad de{' '}
                  <span className="font-medium">"Optimización mobile"</span>
                </p>
                <p className="text-xs text-muted-foreground">hace 2 horas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Sprint Actual</span>
            </CardTitle>
            <CardDescription>
              Sprint 24 - 15 Nov - 29 Nov
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progreso</span>
                <span className="text-foreground font-medium">65%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[65%] bg-gradient-to-r from-primary to-primary-glow rounded-full"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-success">28</p>
                <p className="text-xs text-muted-foreground">Completadas</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-warning">12</p>
                <p className="text-xs text-muted-foreground">En progreso</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-muted-foreground">5</p>
                <p className="text-xs text-muted-foreground">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Import missing component
import { ListTodo } from 'lucide-react';