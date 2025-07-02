import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserPresence {
  user_id: string;
  user_name: string;
  avatar_url?: string;
  online_at: string;
  page: string;
}

export function useRealtime(tableName: string, userId?: string) {
  const { toast } = useToast();
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);

  useEffect(() => {
    // Subscribe to table changes
    const channel = supabase
      .channel(`public:${tableName}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName
        },
        (payload) => {
          console.log('Realtime update:', payload);
          
          // Show toast notification for changes by other users
          if (payload.eventType === 'INSERT') {
            toast({
              title: "Nuevo elemento creado",
              description: "Un compañero de equipo acaba de crear un nuevo elemento.",
              duration: 3000,
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: "Elemento actualizado",
              description: "Un compañero de equipo acaba de actualizar un elemento.",
              duration: 3000,
            });
          } else if (payload.eventType === 'DELETE') {
            toast({
              title: "Elemento eliminado",
              description: "Un compañero de equipo acaba de eliminar un elemento.",
              duration: 3000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, toast]);

  // User presence tracking
  useEffect(() => {
    if (!userId) return;

    const presenceChannel = supabase.channel('user_presence', {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    const userStatus = {
      user_id: userId,
      user_name: 'Usuario', // TODO: Get from user profile when profiles are implemented
      online_at: new Date().toISOString(),
      page: window.location.pathname,
    };

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = presenceChannel.presenceState();
        const users: UserPresence[] = [];
        Object.values(presenceState).forEach((presences) => {
          presences.forEach((presence: any) => {
            if (presence.user_id && presence.user_id !== userId) {
              users.push(presence as UserPresence);
            }
          });
        });
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track(userStatus);
        }
      });

    // Update presence on page visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        presenceChannel.track(userStatus);
      } else {
        presenceChannel.untrack();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      presenceChannel.untrack();
      supabase.removeChannel(presenceChannel);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId]);

  return {
    onlineUsers
  };
}