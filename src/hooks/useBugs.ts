import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { logActivity } from '@/hooks/useActivities';

export interface Bug {
  id: string;
  title: string;
  description: string;
  impact: 'alto' | 'medio' | 'bajo';
  effort_points: number;
  status: 'reportado' | 'en_proceso' | 'qa' | 'resuelto' | 'cerrado';
  assignee_id?: string;
  related_backlog_item?: string;
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
  related_backlog?: {
    id: string;
    title: string;
  };
}

export interface BugComment {
  id: string;
  bug_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: {
    id: string;
    full_name?: string;
    email?: string;
  };
}

export interface BugFilterOptions {
  status?: string;
  impact?: string;
  assignee?: string;
  search?: string;
}

export function useBugs() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BugFilterOptions>({});
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchBugs = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('bugs')
        .select(`
          *,
          assignee:assignee_id(id, full_name, email),
          created_by_profile:created_by(id, full_name, email),
          related_backlog:related_backlog_item(id, title)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters.impact && filters.impact !== 'all') {
        query = query.eq('impact', filters.impact);
      }
      if (filters.assignee && filters.assignee !== 'all') {
        if (filters.assignee === 'unassigned') {
          query = query.is('assignee_id', null);
        } else {
          query = query.eq('assignee_id', filters.assignee);
        }
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching bugs:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los bugs",
          variant: "destructive",
        });
        return;
      }

      setBugs((data || []) as any);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBug = async (bugData: Partial<Bug>) => {
    try {
      const { data, error } = await supabase
        .from('bugs')
        .insert([{ ...bugData, created_by: user?.id } as any])
        .select(`
          *,
          assignee:assignee_id(id, full_name, email),
          created_by_profile:created_by(id, full_name, email),
          related_backlog:related_backlog_item(id, title)
        `)
        .single();

      if (error) {
        throw error;
      }

      setBugs(prev => [data as any, ...prev]);
      
      // Log activity
      await logActivity('created', 'bug', data.id, data.title);
      
      toast({
        title: "Bug reportado",
        description: "El bug se ha reportado exitosamente",
      });

      return data;
    } catch (error) {
      console.error('Error creating bug:', error);
      toast({
        title: "Error",
        description: "No se pudo reportar el bug",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateBug = async (id: string, updates: Partial<Bug>) => {
    try {
      const { data, error } = await supabase
        .from('bugs')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          assignee:assignee_id(id, full_name, email),
          created_by_profile:created_by(id, full_name, email),
          related_backlog:related_backlog_item(id, title)
        `)
        .single();

      if (error) {
        throw error;
      }

      setBugs(prev => prev.map(bug => bug.id === id ? data as any : bug));
      
      // Log activity
      await logActivity('updated', 'bug', data.id, data.title, 
        `Actualizado: ${Object.keys(updates).join(', ')}`);
      
      toast({
        title: "Bug actualizado",
        description: "Los cambios se han guardado exitosamente",
      });

      return data;
    } catch (error) {
      console.error('Error updating bug:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el bug",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteBug = async (id: string) => {
    try {
      // Get bug title before deletion for activity log
      const bugToDelete = bugs.find(bug => bug.id === id);
      const bugTitle = bugToDelete?.title || 'Bug eliminado';
      
      const { error } = await supabase
        .from('bugs')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setBugs(prev => prev.filter(bug => bug.id !== id));
      
      // Log activity
      await logActivity('deleted', 'bug', id, bugTitle);
      
      toast({
        title: "Bug eliminado",
        description: "El bug se ha eliminado exitosamente",
      });
    } catch (error) {
      console.error('Error deleting bug:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el bug",
        variant: "destructive",
      });
      throw error;
    }
  };

  const bulkUpdateStatus = async (ids: string[], status: Bug['status']) => {
    try {
      const { error } = await supabase
        .from('bugs')
        .update({ status })
        .in('id', ids);

      if (error) {
        throw error;
      }

      setBugs(prev => prev.map(bug => 
        ids.includes(bug.id) ? { ...bug, status } : bug
      ));

      toast({
        title: "Estado actualizado",
        description: `${ids.length} bugs actualizados a ${status}`,
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
      .channel('bugs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bugs'
        },
        () => {
          fetchBugs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters]);

  // Fetch bugs when filters change
  useEffect(() => {
    fetchBugs();
  }, [filters]);

  return {
    bugs,
    loading,
    filters,
    setFilters,
    createBug,
    updateBug,
    deleteBug,
    bulkUpdateStatus,
    refetch: fetchBugs
  };
}