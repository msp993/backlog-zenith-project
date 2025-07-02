import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface MetricsOverviewProps {
  totalKPIs: number;
  onTarget: number;
  belowTarget: number;
  averageProgress: number;
  className?: string;
}

export function MetricsOverview({
  totalKPIs,
  onTarget,
  belowTarget,
  averageProgress,
  className
}: MetricsOverviewProps) {
  const progressPercentage = Math.min(averageProgress * 100, 100);

  return (
    <Card className={`glass-card ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Target className="h-5 w-5 text-primary" />
          Resumen Ejecutivo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total KPIs */}
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{totalKPIs}</div>
            <div className="text-sm text-muted-foreground">Total KPIs</div>
          </div>

          {/* On Target */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle className="h-4 w-4 text-success" />
              <div className="text-2xl font-bold text-success">{onTarget}</div>
            </div>
            <div className="text-sm text-muted-foreground">En objetivo</div>
          </div>

          {/* Below Target */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <div className="text-2xl font-bold text-destructive">{belowTarget}</div>
            </div>
            <div className="text-sm text-muted-foreground">Bajo objetivo</div>
          </div>

          {/* Average Progress */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <div className="text-2xl font-bold text-foreground">
                {progressPercentage.toFixed(0)}%
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Progreso medio</div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Progreso Global</span>
            <Badge 
              variant="outline" 
              className={`text-xs border-0 ${
                progressPercentage >= 90 
                  ? 'bg-success text-success-foreground' 
                  : progressPercentage >= 70 
                  ? 'bg-warning text-warning-foreground'
                  : 'bg-destructive text-destructive-foreground'
              }`}
            >
              {progressPercentage.toFixed(1)}%
            </Badge>
          </div>
          <Progress 
            value={progressPercentage} 
            className={`h-3 ${
              progressPercentage >= 90 
                ? 'progress-success' 
                : progressPercentage >= 70 
                ? 'progress-warning'
                : 'progress-destructive'
            }`}
          />
        </div>

        {/* Status Distribution */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
            <div>
              <div className="text-sm font-medium text-foreground">Cumpliendo</div>
              <div className="text-xs text-muted-foreground">≥ 90% del objetivo</div>
            </div>
            <div className="text-lg font-bold text-success">{onTarget}</div>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div>
              <div className="text-sm font-medium text-foreground">Necesita atención</div>
              <div className="text-xs text-muted-foreground">&lt; 90% del objetivo</div>
            </div>
            <div className="text-lg font-bold text-destructive">{belowTarget}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}