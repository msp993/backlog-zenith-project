import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Check, Clock, AlertCircle } from 'lucide-react';
import { BacklogItem } from '@/hooks/useBacklogItems';

interface BulkActionsProps {
  selectedItems: string[];
  onClearSelection: () => void;
  onBulkStatusUpdate: (status: BacklogItem['status']) => void;
  loading?: boolean;
}

export function BulkActions({ selectedItems, onClearSelection, onBulkStatusUpdate, loading }: BulkActionsProps) {
  const [selectedStatus, setSelectedStatus] = useState<BacklogItem['status'] | ''>('');

  if (selectedItems.length === 0) return null;

  const handleStatusUpdate = () => {
    if (selectedStatus) {
      onBulkStatusUpdate(selectedStatus);
      setSelectedStatus('');
    }
  };

  const statusOptions = [
    { value: 'pendiente', label: 'Pendiente', icon: Clock },
    { value: 'en_proceso', label: 'En Proceso', icon: AlertCircle },
    { value: 'qa', label: 'En QA', icon: AlertCircle },
    { value: 'completado', label: 'Completado', icon: Check },
    { value: 'pausado', label: 'Pausado', icon: X },
  ];

  return (
    <Card className="glass-card p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-medium">
              {selectedItems.length} seleccionado{selectedItems.length > 1 ? 's' : ''}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="h-6 w-6 p-0 hover:bg-muted rounded-full"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Cambiar estado a:</span>
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as any)}>
              <SelectTrigger className="w-[160px] h-8 glass-card">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent className="glass-card bg-background/95 backdrop-blur-xl">
                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-3 w-3" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Button
              size="sm"
              onClick={handleStatusUpdate}
              disabled={!selectedStatus || loading}
              className="btn-premium h-8"
            >
              {loading ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Actualización en lote para historias seleccionadas
        </div>
      </div>
    </Card>
  );
}