import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bug } from '@/hooks/useBugs';
import { ImpactIndicator } from './ImpactIndicator';
import { BugStatusBadge } from './BugStatusBadge';
import { ArrowUpDown, MoreHorizontal, User, Clock, Link as LinkIcon } from 'lucide-react';

interface BugTableProps {
  bugs: Bug[];
  selectedBugs: string[];
  onSelectionChange: (selectedBugs: string[]) => void;
  onBugClick: (bug: Bug) => void;
  loading?: boolean;
}

type SortField = 'impact' | 'title' | 'status' | 'assignee' | 'effort_points' | 'created_at';
type SortDirection = 'asc' | 'desc';

export function BugTable({ 
  bugs, 
  selectedBugs, 
  onSelectionChange, 
  onBugClick,
  loading 
}: BugTableProps) {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedBugs = [...bugs].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    // Handle nested properties
    if (sortField === 'assignee') {
      aValue = a.assignee?.full_name || a.assignee?.email || '';
      bValue = b.assignee?.full_name || b.assignee?.email || '';
    }

    // Impact sorting (alto should come first)
    if (sortField === 'impact') {
      const impactOrder = { alto: 1, medio: 2, bajo: 3 };
      aValue = impactOrder[aValue as keyof typeof impactOrder];
      bValue = impactOrder[bValue as keyof typeof impactOrder];
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(bugs.map(bug => bug.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectBug = (bugId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedBugs, bugId]);
    } else {
      onSelectionChange(selectedBugs.filter(id => id !== bugId));
    }
  };

  const isAllSelected = bugs.length > 0 && selectedBugs.length === bugs.length;

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

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'SA';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

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

  if (bugs.length === 0) {
    return (
      <Card className="glass-card">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No se encontraron bugs</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-glass-border hover:bg-glass/50">
            <TableHead className="w-[50px]">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[80px]">
              <SortButton field="impact">Impacto</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="title">Bug</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="status">Estado</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="assignee">Responsable</SortButton>
            </TableHead>
            <TableHead className="w-[100px]">
              <SortButton field="effort_points">Esfuerzo</SortButton>
            </TableHead>
            <TableHead className="w-[100px]">
              <SortButton field="created_at">Creado</SortButton>
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedBugs.map((bug) => (
            <TableRow
              key={bug.id}
              className={`
                border-glass-border hover:bg-glass/50 cursor-pointer transition-all duration-200
                ${selectedBugs.includes(bug.id) ? 'bg-primary/10' : ''}
              `}
              onClick={(e) => {
                e.preventDefault();
                onBugClick(bug);
              }}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedBugs.includes(bug.id)}
                  onCheckedChange={(checked) => handleSelectBug(bug.id, checked as boolean)}
                />
              </TableCell>

              <TableCell>
                <ImpactIndicator impact={bug.impact} />
              </TableCell>

              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-foreground line-clamp-1 flex items-center gap-2">
                    {bug.title}
                    {bug.related_backlog && (
                      <div title="Vinculado a historia de usuario">
                        <LinkIcon className="h-3 w-3 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {bug.description}
                  </div>
                  {bug.related_backlog && (
                    <div className="text-xs text-primary">
                      → {bug.related_backlog.title}
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <BugStatusBadge status={bug.status} />
              </TableCell>

              <TableCell>
                {bug.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-primary/10">
                        {getInitials(bug.assignee.full_name, bug.assignee.email)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-foreground">
                      {bug.assignee.full_name || bug.assignee.email}
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
                    {bug.effort_points}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-sm text-muted-foreground">
                {formatDate(bug.created_at)}
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
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}