import { useKPIs } from '@/hooks/useKPIs';
import { KPICard } from '@/components/kpis/KPICard';
import { TrendChart } from '@/components/kpis/TrendChart';
import { MetricsOverview } from '@/components/kpis/MetricsOverview';
import { GoalProgress } from '@/components/kpis/GoalProgress';
import { TimeRangeSelector } from '@/components/kpis/TimeRangeSelector';
import { CategoryDistribution } from '@/components/kpis/CategoryDistribution';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Settings } from 'lucide-react';

export default function KPIs() {
  const {
    kpis,
    loading,
    filters,
    setFilters,
    kpiTrends,
    metricsOverview
  } = useKPIs();

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting KPI report...');
  };

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-2"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">KPIs & Métricas</h1>
          <p className="text-muted-foreground">
            Centro de control ejecutivo del proyecto
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <TimeRangeSelector
        selectedRange={filters.timeRange}
        onRangeChange={(range) => setFilters({ ...filters, timeRange: range })}
      />

      {/* Metrics Overview */}
      <MetricsOverview
        totalKPIs={metricsOverview.totalKPIs}
        onTarget={metricsOverview.onTarget}
        belowTarget={metricsOverview.belowTarget}
        averageProgress={metricsOverview.averageProgress}
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => {
          const trend = Math.random() > 0.5 ? 'up' : 'down'; // Mock trend
          const trendValue = Math.random() * 10; // Mock trend value
          
          return (
            <KPICard
              key={kpi.id}
              title={kpi.name}
              description={kpi.description || undefined}
              currentValue={Number(kpi.current_value || 0)}
              targetValue={Number(kpi.target_value || 0)}
              unit={kpi.unit || ''}
              category={kpi.category || 'otros'}
              trend={trend}
              trendValue={trendValue}
            />
          );
        })}
      </div>

      {/* Goal Progress */}
      <GoalProgress kpis={kpis} />

      {/* Category Distribution */}
      <CategoryDistribution kpis={kpis} />

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {kpiTrends.slice(0, 4).map((trend, index) => {
          const kpi = kpis.find(k => k.id === trend.kpiId);
          if (!kpi) return null;
          
          return (
            <TrendChart
              key={trend.kpiId}
              title={`Tendencia: ${kpi.name}`}
              data={trend.data}
              type={index % 2 === 0 ? 'line' : 'area'}
              showTarget={true}
            />
          );
        })}
      </div>
    </div>
  );
}