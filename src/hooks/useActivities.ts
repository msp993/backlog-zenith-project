import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Activity {
  id: string;
  user_id: string;
  action_type: 'created' | 'updated' | 'deleted' | 'commented';
  entity_type: 'backlog_item'; // Only backlog items now
  entity_id: string;
  entity_title: string;
  details?: string;
  created_at: string;
  user?: {
    id: string;
    full_name?: string;
    email?: string;
    avatar_url?: string;
  };
}

export async function logActivity(
  action_type: Activity['action_type'],
  entity_id: string,
  entity_title: string,
  details?: string
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user for activity logging');
      return;
    }

    const { error } = await supabase
      .from('activities')
      .insert([{
        user_id: user.id,
        action_type,
        entity_type: 'backlog_item', // Always backlog_item now
        entity_id,
        entity_title,
        details
      }]);

    if (error) {
      console.error('Error logging activity:', error);
    }
  } catch (error) {
    console.error('Unexpected error logging activity:', error);
  }
}

export function useActivities(limit: number = 20) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['activities', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          user:user_id(id, full_name, email, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching activities:', error);
        throw error;
      }

      return (data || []) as Activity[];
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
}