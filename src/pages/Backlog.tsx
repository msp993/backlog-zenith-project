import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Filter, ArrowUpDown, Clock, User } from 'lucide-react';

const mockBacklogItems = [
  {
    id: 1,
    title: "Implementar autenticación con Supabase",
    description: "Configurar sistema de login y registro de usuarios con Supabase Auth",
    priority: "P1",
    status: "En Progreso",
    storyPoints: 8,
    assignee: "María García",
    tags: ["Auth", "Backend"]
  },
  {
    id: 2,
    title: "Diseño responsive del dashboard",
    description: "Adaptar el dashboard principal para dispositivos móviles y tablets",
    priority: "P2",
    status: "Todo",
    storyPoints: 5,
    assignee: "Carlos López",
    tags: ["UI/UX", "Frontend"]
  },
  {
    id: 3,
    title: "API de métricas y KPIs",
    description: "Crear endpoints para consultar y actualizar métricas del proyecto",
    priority: "P1",
    status: "En Review",
    storyPoints: 13,
    assignee: "Ana Martín",
    tags: ["API", "Backend"]
  },
  {
    id: 4,
    title: "Sistema de notificaciones",
    description: "Implementar notificaciones en tiempo real para actualizaciones",
    priority: "P3",
    status: "Todo",
    storyPoints: 8,
    assignee: null,
    tags: ["Realtime", "Frontend"]
  }
];

const priorityColors = {
  P1: "bg-destructive",
  P2: "bg-warning", 
  P3: "bg-primary",
  P4: "bg-success",
  P5: "bg-muted",
  P6: "bg-muted"
};

const statusColors = {
  "Todo": "bg-muted",
  "En Progreso": "bg-warning",
  "En Review": "bg-primary",
  "Completado": "bg-success"
};

export default function Backlog() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Product Backlog</h1>
          <p className="text-muted-foreground">Gestión de historias de usuario y tareas</p>
        </div>
        <Button className="btn-premium">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Historia
        </Button>
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="glass-card">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm" className="glass-card">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Ordenar
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="glass-card">
            {mockBacklogItems.length} historias
          </Badge>
          <Badge variant="outline" className="glass-card">
            {mockBacklogItems.reduce((acc, item) => acc + item.storyPoints, 0)} story points
          </Badge>
        </div>
      </div>

      {/* Backlog Items */}
      <div className="space-y-4">
        {mockBacklogItems.map((item) => (
          <Card key={item.id} className="glass-card hover:bg-glass/90 transition-all duration-200 cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`h-3 w-3 rounded-full ${priorityColors[item.priority as keyof typeof priorityColors]}`}></div>
                  <CardTitle className="text-lg text-foreground">{item.title}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="outline" 
                    className={`${statusColors[item.status as keyof typeof statusColors]} text-white border-0`}
                  >
                    {item.status}
                  </Badge>
                  <Badge variant="outline" className="glass-card">
                    {item.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Story Points */}
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{item.storyPoints} pts</span>
                  </div>
                  
                  {/* Assignee */}
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {item.assignee || "Sin asignar"}
                    </span>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="flex items-center space-x-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}