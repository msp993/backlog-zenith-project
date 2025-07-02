import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

export type KPI = Tables<'kpis'>;

export interface KPIFilters {
  timeRange: '7d' | '30d' | '90d' | 'custom';
  category?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  target?: number;
}

export interface KPITrend {
  kpiId: string;
  data: TimeSeriesData[];
}

export function useKPIs() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<KPIFilters>({
    timeRange: '30d'
  });

  // Fetch KPIs
  const { data: kpis = [], isLoading: loading } = useQuery({
    queryKey: ['kpis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Update KPI
  const updateKPIMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<KPI> }) => {
      const { error } = await supabase
        .from('kpis')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      toast({
        title: "KPI actualizado",
        description: "El indicador se ha actualizado correctamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el KPI.",
        variant: "destructive",
      });
    }
  });

  // Generate mock trend data (in real app, this would come from historical data)
  const generateTrendData = (kpi: KPI): TimeSeriesData[] => {
    const days = filters.timeRange === '7d' ? 7 : filters.timeRange === '30d' ? 30 : 90;
    const data: TimeSeriesData[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate realistic trend data based on current and target values
      const currentValue = kpi.current_value || 0;
      const targetValue = kpi.target_value || 0;
      const variance = Math.random() * 0.2 - 0.1; // ±10% variance
      const trendValue = Number(currentValue) * (1 + variance);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.max(0, trendValue),
        target: Number(targetValue)
      });
    }
    
    return data;
  };

  const kpiTrends = kpis.map(kpi => ({
    kpiId: kpi.id,
    data: generateTrendData(kpi)
  }));

  // Calculate metrics summary
  const metricsOverview = {
    totalKPIs: kpis.length,
    onTarget: kpis.filter(kpi => {
      const current = Number(kpi.current_value || 0);
      const target = Number(kpi.target_value || 0);
      return current >= target * 0.9; // Within 90% of target
    }).length,
    belowTarget: kpis.filter(kpi => {
      const current = Number(kpi.current_value || 0);
      const target = Number(kpi.target_value || 0);
      return current < target * 0.9;
    }).length,
    averageProgress: kpis.reduce((acc, kpi) => {
      const current = Number(kpi.current_value || 0);
      const target = Number(kpi.target_value || 1);
      return acc + (current / target);
    }, 0) / (kpis.length || 1)
  };

  const updateKPI = (id: string, data: Partial<KPI>) => {
    updateKPIMutation.mutate({ id, data });
  };

  return {
    kpis,
    loading,
    filters,
    setFilters,
    kpiTrends,
    metricsOverview,
    updateKPI
  };
}