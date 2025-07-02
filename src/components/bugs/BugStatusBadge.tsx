import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Clock, PlayCircle, TestTube, CheckCircle, XCircle } from 'lucide-react';

interface BugStatusBadgeProps {
  status: 'reportado' | 'en_proceso' | 'qa' | 'resuelto' | 'cerrado';
  className?: string;
}

const statusConfig = {
  reportado: {
    label: 'Reportado',
    className: 'bg-muted text-muted-foreground',
    icon: Clock
  },
  en_proceso: {
    label: 'En Proceso',
    className: 'bg-warning text-warning-foreground',
    icon: PlayCircle
  },
  qa: {
    label: 'En QA',
    className: 'bg-primary text-primary-foreground',
    icon: TestTube
  },
  resuelto: {
    label: 'Resuelto',
    className: 'bg-success text-success-foreground',
    icon: CheckCircle
  },
  cerrado: {
    label: 'Cerrado',
    className: 'bg-muted text-muted-foreground',
    icon: XCircle
  }
};

export function BugStatusBadge({ status, className }: BugStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

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