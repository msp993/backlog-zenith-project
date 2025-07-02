import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface ImpactIndicatorProps {
  impact: 'alto' | 'medio' | 'bajo';
  className?: string;
  showLabel?: boolean;
}

const impactConfig = {
  alto: {
    label: 'Alto',
    className: 'bg-destructive text-destructive-foreground',
    icon: AlertTriangle,
    dotColor: 'bg-destructive'
  },
  medio: {
    label: 'Medio',
    className: 'bg-warning text-warning-foreground',
    icon: AlertCircle,
    dotColor: 'bg-warning'
  },
  bajo: {
    label: 'Bajo',
    className: 'bg-success text-success-foreground',
    icon: Info,
    dotColor: 'bg-success'
  }
};

export function ImpactIndicator({ impact, className, showLabel = true }: ImpactIndicatorProps) {
  const config = impactConfig[impact];
  const Icon = config.icon;

  if (!showLabel) {
    return (
      <div
        className={cn('w-3 h-3 rounded-full', config.dotColor, className)}
        title={`Impacto ${config.label}`}
      />
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'border-0 font-medium text-xs',
        config.className,
        className
      )}
    >
      <Icon className="w-3 h-3 mr-1.5" />
      {config.label}
    </Badge>
  );
}