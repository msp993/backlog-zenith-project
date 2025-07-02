import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, AlertCircle, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  description?: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  category: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  onEdit?: () => void;
  className?: string;
}

const categoryColors = {
  conversion: 'bg-primary text-primary-foreground',
  acquisition: 'bg-secondary text-secondary-foreground',
  quality: 'bg-success text-success-foreground',
  time: 'bg-warning text-warning-foreground',
  satisfaction: 'bg-info text-info-foreground'
};

export function KPICard({
  title,
  description,
  currentValue,
  targetValue,
  unit,
  category,
  trend = 'stable',
  trendValue,
  onEdit,
  className
}: KPICardProps) {
  const progress = Math.min((currentValue / targetValue) * 100, 100);
  const isOnTarget = progress >= 90;
  const isOffTarget = progress < 70;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Target;

  return (
    <Card className={cn('glass-card hover:shadow-lg transition-all duration-300', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={cn(
              'text-xs border-0',
              categoryColors[category as keyof typeof categoryColors] || 'bg-muted text-muted-foreground'
            )}
          >
            {category}
          </Badge>
          {isOffTarget && <AlertCircle className="h-4 w-4 text-destructive" />}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-6 w-6 p-0 hover:bg-background/50"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Current Value */}
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-bold text-foreground">
              {currentValue.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              {unit}
            </div>
          </div>

          {/* Target and Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Objetivo: {targetValue.toLocaleString()} {unit}</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <Progress 
              value={progress} 
              className={cn(
                'h-2',
                isOnTarget && 'progress-success',
                isOffTarget && 'progress-destructive'
              )}
            />
          </div>

          {/* Trend */}
          {trendValue && (
            <div className="flex items-center space-x-1 text-xs">
              <TrendIcon className={cn(
                'h-3 w-3',
                trend === 'up' && 'text-success',
                trend === 'down' && 'text-destructive',
                trend === 'stable' && 'text-muted-foreground'
              )} />
              <span className={cn(
                trend === 'up' && 'text-success',
                trend === 'down' && 'text-destructive',
                trend === 'stable' && 'text-muted-foreground'
              )}>
                {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
                {Math.abs(trendValue).toFixed(1)}% vs mes anterior
              </span>
            </div>
          )}

          {/* Description */}
          {description && (
            <p className="text-xs text-muted-foreground mt-2">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}