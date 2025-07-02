import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, Target } from 'lucide-react';

interface KPI {
  id: string;
  name: string;
  description?: string;
  current_value?: number;
  target_value?: number;
  unit?: string;
  category?: string;
}

interface KPIUpdateModalProps {
  kpi: KPI | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, value: number) => void;
  isUpdating?: boolean;
}

export function KPIUpdateModal({ kpi, open, onOpenChange, onUpdate, isUpdating }: KPIUpdateModalProps) {
  const [value, setValue] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kpi || !value) return;

    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;

    onUpdate(kpi.id, numericValue);
    setValue('');
    onOpenChange(false);
  };

  if (!kpi) return null;

  const currentValue = Number(kpi.current_value || 0);
  const targetValue = Number(kpi.target_value || 0);
  const progressPercentage = targetValue > 0 ? (currentValue / targetValue) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Actualizar KPI
          </DialogTitle>
          <DialogDescription>
            Actualiza el valor actual del KPI "{kpi.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current State */}
          <div className="p-4 rounded-lg bg-muted/50 border border-glass-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Estado Actual</span>
              {kpi.category && (
                <Badge variant="outline" className="text-xs">
                  {kpi.category}
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Valor Actual</p>
                <p className="font-semibold">
                  {currentValue.toLocaleString()}{kpi.unit}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Objetivo</p>
                <p className="font-semibold flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {targetValue.toLocaleString()}{kpi.unit}
                </p>
              </div>
            </div>

            {targetValue > 0 && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-muted-foreground">Progreso</span>
                  <span className="text-xs font-medium">
                    {progressPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progressPercentage >= 100 
                        ? 'bg-success' 
                        : progressPercentage >= 75 
                          ? 'bg-warning' 
                          : 'bg-primary'
                    }`}
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Update Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="kpi-value">Nuevo Valor {kpi.unit && `(${kpi.unit})`}</Label>
              <Input
                id="kpi-value"
                type="number"
                step="0.01"
                placeholder={`Ej: ${currentValue}`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="glass-input"
                required
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isUpdating}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isUpdating || !value}
                className="btn-premium"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Actualizando...
                  </>
                ) : (
                  'Actualizar KPI'
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}