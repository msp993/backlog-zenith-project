import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BacklogItem } from '@/hooks/useBacklogItems';
import { PriorityDot } from './PriorityBadge';
import { StatusBadge } from './StatusBadge';
import { Check, X, User } from 'lucide-react';

interface InlineEditCellProps {
  item: BacklogItem;
  field: keyof BacklogItem;
  value: any;
  onSave: (id: string, field: keyof BacklogItem, value: any) => Promise<void>;
  teamMembers?: any[];
  className?: string;
}

export function InlineEditCell({ item, field, value, onSave, teamMembers = [], className = "" }: InlineEditCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (field === 'title' || field === 'notes') {
        inputRef.current.select();
      }
    }
  }, [isEditing, field]);

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(item.id, field, editValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && field !== 'description' && field !== 'notes') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
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

  if (isEditing) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {field === 'title' && (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="min-w-[200px]"
            disabled={isLoading}
          />
        )}
        
        {(field === 'description' || field === 'notes') && (
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="min-w-[200px] min-h-[60px]"
            disabled={isLoading}
          />
        )}

        {field === 'priority' && (
          <Select value={editValue} onValueChange={(val) => { setEditValue(val); handleSave(); }}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="P1">P1</SelectItem>
              <SelectItem value="P2">P2</SelectItem>
              <SelectItem value="P3">P3</SelectItem>
              <SelectItem value="P4">P4</SelectItem>
              <SelectItem value="P5">P5</SelectItem>
              <SelectItem value="P6">P6</SelectItem>
            </SelectContent>
          </Select>
        )}

        {field === 'status' && (
          <Select value={editValue} onValueChange={(val) => { setEditValue(val); handleSave(); }}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="en_proceso">En Proceso</SelectItem>
              <SelectItem value="qa">QA</SelectItem>
              <SelectItem value="completado">Completado</SelectItem>
              <SelectItem value="pausado">Pausado</SelectItem>
            </SelectContent>
          </Select>
        )}

        {field === 'assignee_id' && (
          <Select value={editValue || ''} onValueChange={(val) => { setEditValue(val === 'unassigned' ? null : val); handleSave(); }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Sin asignar</SelectItem>
              {teamMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.full_name || member.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {isLoading && (
          <div className="flex items-center gap-1">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}
      </div>
    );
  }

  // Display mode
  return (
    <div 
      className={`cursor-pointer hover:bg-glass/50 rounded px-2 py-1 transition-colors ${className}`}
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      {field === 'title' && (
        <div className="font-medium text-foreground line-clamp-1">
          {value || 'Untitled'}
        </div>
      )}

      {field === 'description' && (
        <div className="text-sm text-muted-foreground line-clamp-2">
          {value || 'No description'}
        </div>
      )}

      {field === 'notes' && (
        <div className="text-sm text-foreground line-clamp-2">
          {value || 'Add notes...'}
        </div>
      )}

      {field === 'priority' && (
        <div className="flex items-center gap-2">
          <PriorityDot priority={value} />
        </div>
      )}

      {field === 'status' && (
        <StatusBadge status={value} />
      )}

      {field === 'assignee_id' && (
        <>
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
        </>
      )}
    </div>
  );
}