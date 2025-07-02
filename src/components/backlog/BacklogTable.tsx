import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BacklogItem } from '@/hooks/useBacklogItems';
import { PriorityBadge, PriorityDot } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { SortableBacklogRow } from './SortableBacklogRow';
import { ArrowUpDown, MoreHorizontal, User, Clock } from 'lucide-react';

interface BacklogTableProps {
  items: BacklogItem[];
  selectedItems: string[];
  onSelectionChange: (selectedItems: string[]) => void;
  onItemClick: (item: BacklogItem) => void;
  onItemsReorder?: (items: BacklogItem[]) => void;
  loading?: boolean;
}

type SortField = 'priority' | 'title' | 'status' | 'assignee' | 'story_points' | 'created_at';
type SortDirection = 'asc' | 'desc';

export function BacklogTable({ 
  items, 
  selectedItems, 
  onSelectionChange, 
  onItemClick,
  onItemsReorder,
  loading 
}: BacklogTableProps) {
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    // Handle nested properties
    if (sortField === 'assignee') {
      aValue = a.assignee?.full_name || a.assignee?.email || '';
      bValue = b.assignee?.full_name || b.assignee?.email || '';
    }

    // Priority sorting (P1 should come first)
    if (sortField === 'priority') {
      const priorityOrder = { P1: 1, P2: 2, P3: 3, P4: 4, P5: 5, P6: 6 };
      aValue = priorityOrder[aValue as keyof typeof priorityOrder];
      bValue = priorityOrder[bValue as keyof typeof priorityOrder];
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id && onItemsReorder) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      onItemsReorder(newItems);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(items.map(item => item.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedItems, itemId]);
    } else {
      onSelectionChange(selectedItems.filter(id => id !== itemId));
    }
  };

  const isAllSelected = items.length > 0 && selectedItems.length === items.length;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < items.length;

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      className="h-auto p-0 font-medium text-left justify-start hover:bg-transparent"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
    </Button>
  );

  if (loading) {
    return (
      <Card className="glass-card">
        <div className="p-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4 mx-auto"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="glass-card">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No se encontraron historias de usuario</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <Table>
          <TableHeader>
            <TableRow className="border-glass-border hover:bg-glass/50">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-[50px]">
                <SortButton field="priority">Prioridad</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="title">Historia de Usuario</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="status">Estado</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="assignee">Responsable</SortButton>
              </TableHead>
              <TableHead className="w-[100px]">
                <SortButton field="story_points">Story Points</SortButton>
              </TableHead>
              <TableHead className="w-[120px]">Valor de Negocio</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
              {sortedItems.map((item) => (
                <SortableBacklogRow
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.includes(item.id)}
                  onSelect={(checked) => handleSelectItem(item.id, checked)}
                  onClick={() => onItemClick(item)}
                />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </Card>
  );
}