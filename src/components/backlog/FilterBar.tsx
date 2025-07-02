import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Filter, Search, X } from 'lucide-react';
import { FilterOptions } from '@/hooks/useBacklogItems';
import { useProfiles } from '@/hooks/useProfiles';

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  totalItems: number;
  filteredItems: number;
}

export function FilterBar({ filters, onFiltersChange, totalItems, filteredItems }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const { profiles } = useProfiles();

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
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
            placeholder="Buscar historias de usuario..."
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
                value={filters.status || ''}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="glass-card">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent className="glass-card bg-background/95 backdrop-blur-xl">
                  <SelectItem value="">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="qa">En QA</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="pausado">Pausado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Prioridad</label>
              <Select
                value={filters.priority || ''}
                onValueChange={(value) => handleFilterChange('priority', value)}
              >
                <SelectTrigger className="glass-card">
                  <SelectValue placeholder="Todas las prioridades" />
                </SelectTrigger>
                <SelectContent className="glass-card bg-background/95 backdrop-blur-xl">
                  <SelectItem value="">Todas las prioridades</SelectItem>
                  <SelectItem value="P1">P1 - Crítica</SelectItem>
                  <SelectItem value="P2">P2 - Alta</SelectItem>
                  <SelectItem value="P3">P3 - Media</SelectItem>
                  <SelectItem value="P4">P4 - Baja</SelectItem>
                  <SelectItem value="P5">P5 - Muy Baja</SelectItem>
                  <SelectItem value="P6">P6 - Opcional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Responsable</label>
              <Select
                value={filters.assignee || ''}
                onValueChange={(value) => handleFilterChange('assignee', value)}
              >
                <SelectTrigger className="glass-card">
                  <SelectValue placeholder="Todos los responsables" />
                </SelectTrigger>
                <SelectContent className="glass-card bg-background/95 backdrop-blur-xl">
                  <SelectItem value="">Todos los responsables</SelectItem>
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
          Mostrando {filteredItems} de {totalItems} historias
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