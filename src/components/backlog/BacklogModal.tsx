import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BacklogItem } from '@/hooks/useBacklogItems';
import { useProfiles } from '@/hooks/useProfiles';
import { Badge } from '@/components/ui/badge';
import { PriorityBadge } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';

interface BacklogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: BacklogItem | null;
  onSave: (data: Partial<BacklogItem>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function BacklogModal({ open, onOpenChange, item, onSave, onDelete }: BacklogModalProps) {
  const { profiles } = useProfiles();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<BacklogItem>>({
    title: '',
    description: '',
    user_story: '',
    acceptance_criteria: '',
    priority: 'P3',
    status: 'pendiente',
    business_value: 'medio',
    story_points: 1,
    assignee_id: undefined
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description || '',
        user_story: item.user_story || '',
        acceptance_criteria: item.acceptance_criteria || '',
        priority: item.priority,
        status: item.status,
        business_value: item.business_value,
        story_points: item.story_points,
        assignee_id: item.assignee_id
      });
    } else {
      setFormData({
        title: '',
        description: '',
        user_story: '',
        acceptance_criteria: '',
        priority: 'P3',
        status: 'pendiente',
        business_value: 'medio',
        story_points: 1,
        assignee_id: undefined
      });
    }
  }, [item, open]);

  const handleSave = async () => {
    if (!formData.title?.trim()) return;

    try {
      setLoading(true);
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!item?.id || !onDelete) return;

    try {
      setLoading(true);
      await onDelete(item.id);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-glass-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">
            {item ? 'Editar Historia de Usuario' : 'Nueva Historia de Usuario'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground font-medium">
              Título *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Título de la historia de usuario"
              className="glass-card"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground font-medium">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción detallada de la historia"
              className="glass-card min-h-[100px]"
            />
          </div>

          {/* User Story */}
          <div className="space-y-2">
            <Label htmlFor="user_story" className="text-foreground font-medium">
              Historia de Usuario
            </Label>
            <Textarea
              id="user_story"
              value={formData.user_story}
              onChange={(e) => setFormData({ ...formData, user_story: e.target.value })}
              placeholder="Como [rol], quiero [objetivo] para [beneficio]"
              className="glass-card min-h-[80px]"
            />
          </div>

          {/* Acceptance Criteria */}
          <div className="space-y-2">
            <Label htmlFor="acceptance_criteria" className="text-foreground font-medium">
              Criterios de Aceptación
            </Label>
            <Textarea
              id="acceptance_criteria"
              value={formData.acceptance_criteria}
              onChange={(e) => setFormData({ ...formData, acceptance_criteria: e.target.value })}
              placeholder="Criterios que deben cumplirse para considerar la historia completa"
              className="glass-card min-h-[100px]"
            />
          </div>

          {/* Grid for selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Prioridad</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
              >
                <SelectTrigger className="glass-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card bg-background/95 backdrop-blur-xl">
                  <SelectItem value="P1">P1 - Crítica</SelectItem>
                  <SelectItem value="P2">P2 - Alta</SelectItem>
                  <SelectItem value="P3">P3 - Media</SelectItem>
                  <SelectItem value="P4">P4 - Baja</SelectItem>
                  <SelectItem value="P5">P5 - Muy Baja</SelectItem>
                  <SelectItem value="P6">P6 - Opcional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger className="glass-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card bg-background/95 backdrop-blur-xl">
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="qa">En QA</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="pausado">Pausado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Business Value */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Valor de Negocio</Label>
              <Select
                value={formData.business_value}
                onValueChange={(value) => setFormData({ ...formData, business_value: value as any })}
              >
                <SelectTrigger className="glass-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card bg-background/95 backdrop-blur-xl">
                  <SelectItem value="alto">Alto</SelectItem>
                  <SelectItem value="medio">Medio</SelectItem>
                  <SelectItem value="bajo">Bajo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Story Points */}
            <div className="space-y-2">
              <Label htmlFor="story_points" className="text-foreground font-medium">
                Story Points
              </Label>
              <Select
                value={formData.story_points?.toString()}
                onValueChange={(value) => setFormData({ ...formData, story_points: parseInt(value) })}
              >
                <SelectTrigger className="glass-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card bg-background/95 backdrop-blur-xl">
                  {[1, 2, 3, 5, 8, 13, 21].map((points) => (
                    <SelectItem key={points} value={points.toString()}>
                      {points} {points === 1 ? 'punto' : 'puntos'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Responsable</Label>
            <Select
              value={formData.assignee_id || 'unassigned'}
              onValueChange={(value) => setFormData({ ...formData, assignee_id: value === 'unassigned' ? undefined : value })}
            >
              <SelectTrigger className="glass-card">
                <SelectValue placeholder="Seleccionar responsable" />
              </SelectTrigger>
              <SelectContent className="glass-card bg-background/95 backdrop-blur-xl">
                <SelectItem value="unassigned">Sin asignar</SelectItem>
                {profiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    <div className="flex items-center gap-2">
                      <span>{profile.full_name || profile.email}</span>
                      <Badge variant="outline" className="text-xs">
                        {profile.role}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview badges */}
          {(formData.priority || formData.status) && (
            <div className="flex items-center gap-2 pt-2 border-t border-glass-border">
              <span className="text-sm text-muted-foreground">Vista previa:</span>
              {formData.priority && <PriorityBadge priority={formData.priority} />}
              {formData.status && <StatusBadge status={formData.status} />}
              {formData.business_value && (
                <Badge variant="outline" className="text-xs">
                  Valor: {formData.business_value}
                </Badge>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {item && onDelete && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                Eliminar
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="glass-card"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.title?.trim() || loading}
              className="btn-premium"
            >
              {loading ? 'Guardando...' : item ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}