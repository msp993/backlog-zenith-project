import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BacklogItem } from '@/hooks/useBacklogItems';
import { PriorityDot } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { MoreHorizontal, GripVertical, User, Clock } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SortableBacklogRowProps {
  item: BacklogItem;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onClick: () => void;
}

export function SortableBacklogRow({ item, isSelected, onSelect, onClick }: SortableBacklogRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getBusinessValueColor = (value: string) => {
    switch (value) {
      case 'alto': return 'bg-success text-success-foreground';
      case 'medio': return 'bg-warning text-warning-foreground';
      case 'bajo': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'SA';
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`
        border-glass-border hover:bg-glass/50 cursor-pointer transition-all duration-200
        ${isDragging ? 'opacity-50 shadow-lg' : ''}
        ${isSelected ? 'bg-primary/10' : ''}
      `}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
        />
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-2">
          <button
            className="opacity-0 group-hover:opacity-100 hover:bg-muted rounded p-1 transition-opacity"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>
          <PriorityDot priority={item.priority} />
        </div>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          <div className="font-medium text-foreground line-clamp-1">
            {item.title}
          </div>
          {item.description && (
            <div className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </div>
          )}
        </div>
      </TableCell>

      <TableCell>
        <StatusBadge status={item.status} />
      </TableCell>

      <TableCell>
        {item.assignee ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-primary/10">
                {getInitials(item.assignee.full_name, item.assignee.email)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-foreground">
              {item.assignee.full_name || item.assignee.email}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="text-sm">Sin asignar</span>
          </div>
        )}
      </TableCell>

      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm font-medium">
            {item.story_points || 0}
          </span>
        </div>
      </TableCell>

      <TableCell>
        <Badge
          variant="outline"
          className={`border-0 text-xs ${getBusinessValueColor(item.business_value)}`}
        >
          {item.business_value}
        </Badge>
      </TableCell>

      <TableCell onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}