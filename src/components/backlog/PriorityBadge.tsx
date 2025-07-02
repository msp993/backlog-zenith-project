import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';
  className?: string;
}

const priorityConfig = {
  P1: {
    label: 'P1 - Crítica',
    className: 'bg-destructive text-destructive-foreground',
    dotColor: 'bg-destructive'
  },
  P2: {
    label: 'P2 - Alta',
    className: 'bg-warning text-warning-foreground',
    dotColor: 'bg-warning'
  },
  P3: {
    label: 'P3 - Media',
    className: 'bg-primary text-primary-foreground',
    dotColor: 'bg-primary'
  },
  P4: {
    label: 'P4 - Baja',
    className: 'bg-success text-success-foreground',
    dotColor: 'bg-success'
  },
  P5: {
    label: 'P5 - Muy Baja',
    className: 'bg-muted text-muted-foreground',
    dotColor: 'bg-muted-foreground'
  },
  P6: {
    label: 'P6 - Opcional',
    className: 'bg-muted text-muted-foreground',
    dotColor: 'bg-muted-foreground'
  }
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <Badge
      variant="outline"
      className={cn(
        'border-0 font-medium text-xs',
        config.className,
        className
      )}
    >
      <div className={cn('w-2 h-2 rounded-full mr-1.5', config.dotColor)} />
      {priority}
    </Badge>
  );
}

export function PriorityDot({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <div
      className={cn('w-3 h-3 rounded-full', config.dotColor, className)}
      title={config.label}
    />
  );
}