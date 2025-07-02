import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KPI } from '@/hooks/useKPIs';
import { PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

interface CategoryDistributionProps {
  kpis: KPI[];
  className?: string;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--info))',
  'hsl(var(--muted))'
];

const chartConfig = {
  kpis: {
    label: "KPIs",
  },
};

export function CategoryDistribution({ kpis, className }: CategoryDistributionProps) {
  // Group KPIs by category
  const categoryData = kpis.reduce((acc, kpi) => {
    const category = kpi.category || 'otros';
    if (!acc[category]) {
      acc[category] = {
        category,
        count: 0,
        totalValue: 0,
        averageProgress: 0
      };
    }
    acc[category].count += 1;
    acc[category].totalValue += Number(kpi.current_value || 0);
    
    const progress = Number(kpi.current_value || 0) / Number(kpi.target_value || 1);
    acc[category].averageProgress += progress;
    
    return acc;
  }, {} as Record<string, any>);

  // Convert to arrays for charts
  const pieData = Object.values(categoryData).map((item: any) => ({
    name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
    value: item.count,
    averageProgress: item.averageProgress / item.count
  }));

  const barData = Object.values(categoryData).map((item: any) => ({
    category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
    progress: (item.averageProgress / item.count) * 100,
    count: item.count
  }));

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">KPIs: {data.value}</p>
          <p className="text-sm text-muted-foreground">
            Progreso promedio: {(data.averageProgress * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">
            Progreso promedio: {payload[0].value.toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">
            Total KPIs: {payload[0].payload.count}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {/* Pie Chart - Distribution by Category */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <PieChartIcon className="h-5 w-5 text-primary" />
            Distribución por Categoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Bar Chart - Average Progress by Category */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <BarChart3 className="h-5 w-5 text-primary" />
            Progreso por Categoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="category" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar 
                  dataKey="progress" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}