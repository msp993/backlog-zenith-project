import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'pendiente' | 'en_proceso' | 'qa' | 'completado' | 'pausado';
  className?: string;
}

const statusConfig = {
  pendiente: {
    label: 'Pendiente',
    className: 'bg-muted text-muted-foreground'
  },
  en_proceso: {
    label: 'En Proceso',
    className: 'bg-warning text-warning-foreground'
  },
  qa: {
    label: 'En QA',
    className: 'bg-primary text-primary-foreground'
  },
  completado: {
    label: 'Completado',
    className: 'bg-success text-success-foreground'
  },
  pausado: {
    label: 'Pausado',
    className: 'bg-destructive/80 text-destructive-foreground'
  }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        'border-0 font-medium text-xs',
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}