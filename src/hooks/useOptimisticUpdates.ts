import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface OptimisticUpdate<T> {
  id: string;
  data: T;
  timestamp: number;
}

export function useOptimisticUpdates<T>(queryKey: string[]) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [pendingUpdates, setPendingUpdates] = useState<OptimisticUpdate<T>[]>([]);

  const addOptimisticUpdate = useCallback((id: string, data: T) => {
    const update: OptimisticUpdate<T> = {
      id,
      data,
      timestamp: Date.now()
    };

    setPendingUpdates(prev => [...prev, update]);

    // Update the query cache optimistically
    queryClient.setQueryData(queryKey, (oldData: T[] | undefined) => {
      if (!oldData) return [data];
      const existingIndex = oldData.findIndex((item: any) => item.id === id);
      if (existingIndex >= 0) {
        const newData = [...oldData];
        newData[existingIndex] = { ...oldData[existingIndex], ...data };
        return newData;
      }
      return [...oldData, data];
    });

    return update;
  }, [queryClient, queryKey]);

  const removeOptimisticUpdate = useCallback((updateId: string) => {
    setPendingUpdates(prev => prev.filter(update => update.id !== updateId));
  }, []);

  const rollbackOptimisticUpdate = useCallback((updateId: string) => {
    setPendingUpdates(prev => prev.filter(update => update.id !== updateId));
    
    // Invalidate the query to fetch fresh data
    queryClient.invalidateQueries({ queryKey });
    
    toast({
      title: "Error en la actualización",
      description: "Los cambios se han revertido automáticamente.",
      variant: "destructive",
    });
  }, [queryClient, queryKey, toast]);

  const handleOptimisticMutation = useCallback(async <U>(
    id: string,
    optimisticData: T,
    mutationFn: () => Promise<U>
  ): Promise<U> => {
    const update = addOptimisticUpdate(id, optimisticData);
    
    try {
      const result = await mutationFn();
      removeOptimisticUpdate(update.id);
      return result;
    } catch (error) {
      rollbackOptimisticUpdate(update.id);
      throw error;
    }
  }, [addOptimisticUpdate, removeOptimisticUpdate, rollbackOptimisticUpdate]);

  return {
    pendingUpdates,
    handleOptimisticMutation
  };
}