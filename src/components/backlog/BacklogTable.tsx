import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { BacklogItem } from '@/hooks/useBacklogItems';
import { InlineEditCell } from './InlineEditCell';
import { SortableBacklogRow } from './SortableBacklogRow';
import { ArrowUpDown, ChevronDown, ChevronRight } from 'lucide-react';

interface BacklogTableProps {
  items: BacklogItem[];
  selectedItems: string[];
  onSelectionChange: (selectedItems: string[]) => void;
  onItemClick: (item: BacklogItem) => void;
  onItemsReorder?: (items: BacklogItem[]) => void;
  onFieldUpdate?: (id: string, field: keyof BacklogItem, value: any) => Promise<void>;
  teamMembers?: any[];
  loading?: boolean;
}

type SortField = 'priority' | 'title' | 'status' | 'assignee' | 'notes' | 'created_at';
type SortDirection = 'asc' | 'desc';

export function BacklogTable({ 
  items, 
  selectedItems, 
  onSelectionChange, 
  onItemClick,
  onItemsReorder,
  onFieldUpdate,
  teamMembers = [],
  loading 
}: BacklogTableProps) {
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [completedCollapsed, setCompletedCollapsed] = useState(false);

  // Separate active and completed items
  const activeItems = items.filter(item => item.status !== 'completado');
  const completedItems = items.filter(item => item.status === 'completado');

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
      // Only allow reordering within active items
      const oldIndex = activeItems.findIndex(item => item.id === active.id);
      const newIndex = activeItems.findIndex(item => item.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newActiveItems = arrayMove(activeItems, oldIndex, newIndex);
        const newItems = [...newActiveItems, ...completedItems];
        onItemsReorder(newItems);
      }
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(activeItems.map(item => item.id));
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

  const isAllSelected = activeItems.length > 0 && selectedItems.length === activeItems.length;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < activeItems.length;

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
              <TableHead className="w-[200px]">
                <SortButton field="notes">Notas</SortButton>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <SortableContext items={activeItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
              {sortedItems.filter(item => item.status !== 'completado').map((item) => (
                <SortableBacklogRow
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.includes(item.id)}
                  onSelect={(checked) => handleSelectItem(item.id, checked)}
                  onClick={() => onItemClick(item)}
                  onFieldUpdate={onFieldUpdate}
                  teamMembers={teamMembers}
                />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
      
      {completedItems.length > 0 && (
        <Collapsible open={!completedCollapsed} onOpenChange={setCompletedCollapsed}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-4 h-auto">
              <div className="flex items-center gap-2">
                {completedCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span className="font-medium">Elementos Completados</span>
                <Badge variant="outline">{completedItems.length}</Badge>
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Table>
              <TableBody>
                {sortedItems.filter(item => item.status === 'completado').map((item) => (
                  <TableRow
                    key={item.id}
                    className="opacity-60 border-glass-border hover:bg-glass/30 cursor-pointer"
                    onClick={() => onItemClick(item)}
                  >
                    <TableCell className="w-[50px]">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item.id, !!checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    
                    <TableCell className="w-[50px]">
                      <InlineEditCell
                        item={item}
                        field="priority"
                        value={item.priority}
                        onSave={onFieldUpdate || (() => Promise.resolve())}
                        teamMembers={teamMembers}
                      />
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

                    <TableCell className="w-[50px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-muted"
                        onClick={(e) => {
                          e.stopPropagation();
                          onItemClick(item);
                        }}
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CollapsibleContent>
        </Collapsible>
      )}
    </Card>
  );
}