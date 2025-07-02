import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableCell, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { BacklogItem } from '@/hooks/useBacklogItems';
import { InlineEditCell } from './InlineEditCell';
import { MoreHorizontal, GripVertical } from 'lucide-react';

interface SortableBacklogRowProps {
  item: BacklogItem;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onClick: () => void;
  onFieldUpdate?: (id: string, field: keyof BacklogItem, value: any) => Promise<void>;
  teamMembers?: any[];
}

export function SortableBacklogRow({ item, isSelected, onSelect, onClick, onFieldUpdate, teamMembers = [] }: SortableBacklogRowProps) {
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
          <InlineEditCell
            item={item}
            field="priority"
            value={item.priority}
            onSave={onFieldUpdate || (() => Promise.resolve())}
            teamMembers={teamMembers}
          />
        </div>
      </TableCell>

      <TableCell>
        <div className="space-y-1">
          <InlineEditCell
            item={item}
            field="title"
            value={item.title}
            onSave={onFieldUpdate || (() => Promise.resolve())}
            teamMembers={teamMembers}
          />
          {item.description && (
            <InlineEditCell
              item={item}
              field="description"
              value={item.description}
              onSave={onFieldUpdate || (() => Promise.resolve())}
              teamMembers={teamMembers}
            />
          )}
        </div>
      </TableCell>

      <TableCell>
        <InlineEditCell
          item={item}
          field="status"
          value={item.status}
          onSave={onFieldUpdate || (() => Promise.resolve())}
          teamMembers={teamMembers}
        />
      </TableCell>

      <TableCell>
        <InlineEditCell
          item={item}
          field="assignee_id"
          value={item.assignee_id}
          onSave={onFieldUpdate || (() => Promise.resolve())}
          teamMembers={teamMembers}
        />
      </TableCell>

      <TableCell className="w-[200px]">
        <InlineEditCell
          item={item}
          field="notes"
          value={item.notes}
          onSave={onFieldUpdate || (() => Promise.resolve())}
          teamMembers={teamMembers}
        />
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