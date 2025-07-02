import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Bug } from '@/hooks/useBugs';
import { useProfiles } from '@/hooks/useProfiles';
import { useBacklogItems } from '@/hooks/useBacklogItems';
import { Badge } from '@/components/ui/badge';
import { ImpactIndicator } from './ImpactIndicator';
import { BugStatusBadge } from './BugStatusBadge';
import { Link } from 'lucide-react';

interface BugModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bug?: Bug | null;
  onSave: (data: Partial<Bug>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function BugModal({ open, onOpenChange, bug, onSave, onDelete }: BugModalProps) {
  const { profiles } = useProfiles();
  const { items: backlogItems } = useBacklogItems();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Bug>>({
    title: '',
    description: '',
    impact: 'medio',
    status: 'reportado',
    effort_points: 1,
    assignee_id: undefined,
    related_backlog_item: undefined
  });

  useEffect(() => {
    if (bug) {
      setFormData({
        title: bug.title,
        description: bug.description,
        impact: bug.impact,
        status: bug.status,
        effort_points: bug.effort_points,
        assignee_id: bug.assignee_id,
        related_backlog_item: bug.related_backlog_item
      });
    } else {
      setFormData({
        title: '',
        description: '',
        impact: 'medio',
        status: 'reportado',
        effort_points: 1,
        assignee_id: undefined,
        related_backlog_item: undefined
      });
    }
  }, [bug, open]);

  const handleSave = async () => {
    if (!formData.title?.trim() || !formData.description?.trim()) return;

    try {
      setLoading(true);
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving bug:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!bug?.id || !onDelete) return;

    try {
      setLoading(true);
      await onDelete(bug.id);
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting bug:', error);
    } finally {
      setLoading(false);
    }
  };

  const bugTemplates = [
    {
      name: 'Bug de UI',
      template: `**Descripción del problema:**
[Describe qué está mal en la interfaz]

**Pasos para reproducir:**
1. 
2. 
3. 

**Resultado esperado:**
[Qué debería pasar]

**Resultado actual:**
[Qué está pasando]

**Dispositivo/Navegador:**
[Información del entorno]`
    },
    {
      name: 'Bug de funcionalidad',
      template: `**Funcionalidad afectada:**
[Nombre de la función]

**Comportamiento esperado:**
[Cómo debería funcionar]

**Comportamiento actual:**
[Cómo está funcionando]

**Datos de prueba:**
[Datos usados para la prueba]

**Impacto:**
[A quiénes afecta y cómo]`
    }
  ];

  const applyTemplate = (template: string) => {
    setFormData({ ...formData, description: template });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-glass-border max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">
            {bug ? 'Editar Bug' : 'Reportar Nuevo Bug'}
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
              placeholder="Resumen breve del bug"
              className="glass-card"
            />
          </div>

          {/* Templates (only for new bugs) */}
          {!bug && (
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Templates</Label>
              <div className="flex gap-2">
                {bugTemplates.map((template) => (
                  <Button
                    key={template.name}
                    variant="outline"
                    size="sm"
                    onClick={() => applyTemplate(template.template)}
                    className="glass-card text-xs"
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground font-medium">
              Descripción *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción detallada del bug, pasos para reproducir, etc."
              className="glass-card min-h-[150px]"
            />
          </div>

          {/* Grid for selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Impact */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Impacto</Label>
              <Select
                value={formData.impact}
                onValueChange={(value) => setFormData({ ...formData, impact: value as any })}
              >
                <SelectTrigger className="glass-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card bg-background/95 backdrop-blur-xl">
                  <SelectItem value="alto">Alto - Crítico</SelectItem>
                  <SelectItem value="medio">Medio - Importante</SelectItem>
                  <SelectItem value="bajo">Bajo - Menor</SelectItem>
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
                  <SelectItem value="reportado">Reportado</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="qa">En QA</SelectItem>
                  <SelectItem value="resuelto">Resuelto</SelectItem>
                  <SelectItem value="cerrado">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Effort Points */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Esfuerzo (Story Points)</Label>
              <Select
                value={formData.effort_points?.toString()}
                onValueChange={(value) => setFormData({ ...formData, effort_points: parseInt(value) })}
              >
                <SelectTrigger className="glass-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card bg-background/95 backdrop-blur-xl">
                  {[1, 2, 3, 5, 8, 13].map((points) => (
                    <SelectItem key={points} value={points.toString()}>
                      {points} {points === 1 ? 'punto' : 'puntos'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </div>

          {/* Related Backlog Item */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">
              <Link className="w-4 h-4 inline mr-2" />
              Historia de Usuario Relacionada
            </Label>
            <Select
              value={formData.related_backlog_item || 'none'}
              onValueChange={(value) => setFormData({ ...formData, related_backlog_item: value === 'none' ? undefined : value })}
            >
              <SelectTrigger className="glass-card">
                <SelectValue placeholder="Vincular con historia de usuario" />
              </SelectTrigger>
              <SelectContent className="glass-card bg-background/95 backdrop-blur-xl">
                <SelectItem value="none">No vincular</SelectItem>
                {backlogItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    <div className="flex items-center gap-2">
                      <span className="truncate">{item.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.priority}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview badges */}
          {(formData.impact || formData.status) && (
            <div className="flex items-center gap-2 pt-2 border-t border-glass-border">
              <span className="text-sm text-muted-foreground">Vista previa:</span>
              {formData.impact && <ImpactIndicator impact={formData.impact} />}
              {formData.status && <BugStatusBadge status={formData.status} />}
              {formData.effort_points && (
                <Badge variant="outline" className="text-xs">
                  {formData.effort_points} pts
                </Badge>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {bug && onDelete && (
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
              disabled={!formData.title?.trim() || !formData.description?.trim() || loading}
              className="btn-premium"
            >
              {loading ? 'Guardando...' : bug ? 'Actualizar' : 'Reportar Bug'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}