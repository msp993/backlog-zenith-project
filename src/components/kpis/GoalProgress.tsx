import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend, Cell } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';
import { KPI } from '@/hooks/useKPIs';

interface GoalProgressProps {
  kpis: KPI[];
  className?: string;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--info))'
];

export function GoalProgress({ kpis, className }: GoalProgressProps) {
  const chartData = kpis.map((kpi, index) => {
    const current = Number(kpi.current_value || 0);
    const target = Number(kpi.target_value || 1);
    const progress = Math.min((current / target) * 100, 100);
    
    return {
      name: kpi.name,
      progress: progress,
      current: current,
      target: target,
      unit: kpi.unit || '',
      fill: COLORS[index % COLORS.length]
    };
  });

  const chartConfig = {
    progress: {
      label: "Progreso",
    },
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {/* Radial Progress Chart */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Target className="h-5 w-5 text-primary" />
            Progreso hacia Objetivos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="20%" 
                outerRadius="80%" 
                data={chartData}
              >
                <RadialBar
                  dataKey="progress"
                  cornerRadius={10}
                  fill="hsl(var(--primary))"
                />
                <Legend 
                  content={({ payload }) => (
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      {payload?.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-muted-foreground truncate">
                            {entry.value}: {chartData[index]?.progress.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Individual Progress Bars */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            Detalle por KPI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartData.map((item, index) => {
              const isOnTarget = item.progress >= 90;
              const isOffTarget = item.progress < 70;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-sm font-medium text-foreground truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline"
                        className={`text-xs border-0 ${
                          isOnTarget 
                            ? 'bg-success text-success-foreground' 
                            : isOffTarget 
                            ? 'bg-destructive text-destructive-foreground'
                            : 'bg-warning text-warning-foreground'
                        }`}
                      >
                        {item.progress.toFixed(1)}%
                      </Badge>
                      {item.progress >= 100 ? (
                        <TrendingUp className="h-3 w-3 text-success" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  
                  <Progress 
                    value={item.progress} 
                    className={`h-2 ${
                      isOnTarget 
                        ? 'progress-success' 
                        : isOffTarget 
                        ? 'progress-destructive'
                        : 'progress-warning'
                    }`}
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      Actual: {item.current.toLocaleString()} {item.unit}
                    </span>
                    <span>
                      Objetivo: {item.target.toLocaleString()} {item.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}