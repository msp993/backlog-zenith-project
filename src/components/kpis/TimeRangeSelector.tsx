import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeRangeSelectorProps {
  selectedRange: '7d' | '30d' | '90d' | 'custom';
  onRangeChange: (range: '7d' | '30d' | '90d' | 'custom') => void;
  className?: string;
}

const timeRangeOptions = [
  { value: '7d' as const, label: '7 días', description: 'Última semana' },
  { value: '30d' as const, label: '30 días', description: 'Último mes' },
  { value: '90d' as const, label: '90 días', description: 'Último trimestre' },
  { value: 'custom' as const, label: 'Personalizado', description: 'Rango específico' },
];

export function TimeRangeSelector({
  selectedRange,
  onRangeChange,
  className
}: TimeRangeSelectorProps) {
  return (
    <Card className={cn('glass-card', className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Período de análisis</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {timeRangeOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedRange === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onRangeChange(option.value)}
              className={cn(
                'flex flex-col items-center gap-1 h-auto py-2 px-3',
                selectedRange === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-muted'
              )}
            >
              <span className="text-xs font-medium">{option.label}</span>
              <span className="text-xs opacity-75">{option.description}</span>
            </Button>
          ))}
        </div>

        {selectedRange === 'custom' && (
          <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Selector de fechas personalizado - próximamente</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}