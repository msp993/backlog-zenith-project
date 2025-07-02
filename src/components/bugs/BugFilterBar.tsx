import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Filter, Search, X } from 'lucide-react';
import { BugFilterOptions } from '@/hooks/useBugs';
import { useProfiles } from '@/hooks/useProfiles';

interface BugFilterBarProps {
  filters: BugFilterOptions;
  onFiltersChange: (filters: BugFilterOptions) => void;
  totalBugs: number;
  filteredBugs: number;
}

export function BugFilterBar({ filters, onFiltersChange, totalBugs, filteredBugs }: BugFilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const { profiles } = useProfiles();

  const handleFilterChange = (key: keyof BugFilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? undefined : value
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar bugs..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10 glass-card"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="glass-card"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="p-4 glass-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Estado</label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="glass-card">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent className="glass-card bg-background/95 backdrop-blur-xl">
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="reportado">Reportado</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="qa">En QA</SelectItem>
                  <SelectItem value="resuelto">Resuelto</SelectItem>
                  <SelectItem value="cerrado">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Impacto</label>
              <Select
                value={filters.impact || 'all'}
                onValueChange={(value) => handleFilterChange('impact', value)}
              >
                <SelectTrigger className="glass-card">
                  <SelectValue placeholder="Todos los impactos" />
                </SelectTrigger>
                <SelectContent className="glass-card bg-background/95 backdrop-blur-xl">
                  <SelectItem value="all">Todos los impactos</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                  <SelectItem value="medio">Medio</SelectItem>
                  <SelectItem value="bajo">Bajo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Responsable</label>
              <Select
                value={filters.assignee || 'all'}
                onValueChange={(value) => handleFilterChange('assignee', value)}
              >
                <SelectTrigger className="glass-card">
                  <SelectValue placeholder="Todos los responsables" />
                </SelectTrigger>
                <SelectContent className="glass-card bg-background/95 backdrop-blur-xl">
                  <SelectItem value="all">Todos los responsables</SelectItem>
                  <SelectItem value="unassigned">Sin asignar</SelectItem>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.full_name || profile.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Mostrando {filteredBugs} de {totalBugs} bugs
          {activeFiltersCount > 0 && (
            <span className="ml-2">
              ({activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} activo{activeFiltersCount > 1 ? 's' : ''})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}