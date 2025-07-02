import { Card, CardContent } from '@/components/ui/card';
import { OnlineUsers } from './OnlineUsers';
import { ActivityFeed } from './ActivityFeed';
import { UserPresence } from '@/hooks/useRealtime';

interface CollaborationSidebarProps {
  onlineUsers: UserPresence[];
  className?: string;
}

export function CollaborationSidebar({ onlineUsers, className }: CollaborationSidebarProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <OnlineUsers users={onlineUsers} />
      <ActivityFeed limit={8} />
    </div>
  );
}