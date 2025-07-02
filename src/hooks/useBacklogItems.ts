import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { logActivity } from '@/hooks/useActivities';

export interface BacklogItem {
  id: string;
  title: string;
  description?: string;
  user_story?: string;
  acceptance_criteria?: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';
  status: 'pendiente' | 'en_proceso' | 'qa' | 'completado' | 'pausado';
  business_value: 'alto' | 'medio' | 'bajo';
  story_points?: number;
  assignee_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  assignee?: {
    id: string;
    full_name?: string;
    email?: string;
  };
  created_by_profile?: {
    id: string;
    full_name?: string;
    email?: string;
  };
}

export interface FilterOptions {
  status?: string;
  priority?: string;
  assignee?: string;
  search?: string;
}

export function useBacklogItems() {
  const [items, setItems] = useState<BacklogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({});
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchItems = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('backlog_items')
        .select(`
          *,
          assignee:assignee_id(id, full_name, email),
          created_by_profile:created_by(id, full_name, email)
        `)
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.assignee) {
        query = query.eq('assignee_id', filters.assignee);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching backlog items:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las historias de usuario",
          variant: "destructive",
        });
        return;
      }

      setItems((data || []) as any);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData: Partial<BacklogItem>) => {
    try {
      const { data, error } = await supabase
        .from('backlog_items')
        .insert([{ ...itemData, created_by: user?.id } as any])
        .select(`
          *,
          assignee:assignee_id(id, full_name, email),
          created_by_profile:created_by(id, full_name, email)
        `)
        .single();

      if (error) {
        throw error;
      }

      setItems(prev => [data as any, ...prev]);
      
      // Log activity
      await logActivity('created', 'backlog_item', data.id, data.title);
      
      toast({
        title: "Historia creada",
        description: "La historia de usuario se ha creado exitosamente",
      });

      return data;
    } catch (error) {
      console.error('Error creating item:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la historia de usuario",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateItem = async (id: string, updates: Partial<BacklogItem>) => {
    try {
      const { data, error } = await supabase
        .from('backlog_items')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          assignee:assignee_id(id, full_name, email),
          created_by_profile:created_by(id, full_name, email)
        `)
        .single();

      if (error) {
        throw error;
      }

      setItems(prev => prev.map(item => item.id === id ? data as any : item));
      
      // Log activity
      await logActivity('updated', 'backlog_item', data.id, data.title, 
        `Actualizado: ${Object.keys(updates).join(', ')}`);
      
      toast({
        title: "Historia actualizada",
        description: "Los cambios se han guardado exitosamente",
      });

      return data;
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la historia de usuario",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      // Get item title before deletion for activity log
      const itemToDelete = items.find(item => item.id === id);
      const itemTitle = itemToDelete?.title || 'Historia eliminada';
      
      const { error } = await supabase
        .from('backlog_items')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setItems(prev => prev.filter(item => item.id !== id));
      
      // Log activity
      await logActivity('deleted', 'backlog_item', id, itemTitle);
      
      toast({
        title: "Historia eliminada",
        description: "La historia de usuario se ha eliminado exitosamente",
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la historia de usuario",
        variant: "destructive",
      });
      throw error;
    }
  };

  const bulkUpdateStatus = async (ids: string[], status: BacklogItem['status']) => {
    try {
      const { error } = await supabase
        .from('backlog_items')
        .update({ status })
        .in('id', ids);

      if (error) {
        throw error;
      }

      setItems(prev => prev.map(item => 
        ids.includes(item.id) ? { ...item, status } : item
      ));

      toast({
        title: "Estado actualizado",
        description: `${ids.length} historias actualizadas a ${status}`,
      });
    } catch (error) {
      console.error('Error bulk updating status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('backlog-items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'backlog_items'
        },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters]);

  // Fetch items when filters change
  useEffect(() => {
    fetchItems();
  }, [filters]);

  return {
    items,
    loading,
    filters,
    setFilters,
    createItem,
    updateItem,
    deleteItem,
    bulkUpdateStatus,
    refetch: fetchItems
  };
}