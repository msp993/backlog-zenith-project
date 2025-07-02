import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useBugs, Bug } from '@/hooks/useBugs';
import { BugFilterBar } from '@/components/bugs/BugFilterBar';
import { BugTable } from '@/components/bugs/BugTable';
import { BugModal } from '@/components/bugs/BugModal';

export default function Bugs() {
  const {
    bugs,
    loading,
    filters,
    setFilters,
    createBug,
    updateBug,
    deleteBug,
    bulkUpdateStatus
  } = useBugs();

  const [selectedBugs, setSelectedBugs] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBug, setEditingBug] = useState<Bug | null>(null);

  // Apply filters to bugs
  const filteredBugs = bugs.filter(bug => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!bug.title.toLowerCase().includes(searchLower) && 
          !bug.description.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    return true;
  });

  const handleCreateNew = () => {
    setEditingBug(null);
    setModalOpen(true);
  };

  const handleEditBug = (bug: Bug) => {
    setEditingBug(bug);
    setModalOpen(true);
  };

  const handleSaveBug = async (data: Partial<Bug>) => {
    if (editingBug) {
      await updateBug(editingBug.id, data);
    } else {
      await createBug(data);
    }
  };

  const handleDeleteBug = async (id: string) => {
    await deleteBug(id);
  };

  const totalEffortPoints = filteredBugs.reduce((acc, bug) => acc + (bug.effort_points || 0), 0);
  const criticalBugs = filteredBugs.filter(bug => bug.impact === 'alto').length;
  const openBugs = filteredBugs.filter(bug => !['resuelto', 'cerrado'].includes(bug.status)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bug Tracking</h1>
          <p className="text-muted-foreground">Gestión de bugs y issues del proyecto</p>
        </div>
        <Button onClick={handleCreateNew} className="btn-premium">
          <Plus className="h-4 w-4 mr-2" />
          Reportar Bug
        </Button>
      </div>

      {/* Filters */}
      <BugFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        totalBugs={bugs.length}
        filteredBugs={filteredBugs.length}
      />

      {/* Summary */}
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="glass-card">
          {filteredBugs.length} bug{filteredBugs.length !== 1 ? 's' : ''}
        </Badge>
        <Badge variant="outline" className="glass-card">
          {openBugs} abierto{openBugs !== 1 ? 's' : ''}
        </Badge>
        <Badge variant="outline" className="glass-card">
          {criticalBugs} crítico{criticalBugs !== 1 ? 's' : ''}
        </Badge>
        <Badge variant="outline" className="glass-card">
          {totalEffortPoints} puntos de esfuerzo
        </Badge>
        {selectedBugs.length > 0 && (
          <Badge variant="secondary">
            {selectedBugs.length} seleccionado{selectedBugs.length !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Table */}
      <BugTable
        bugs={filteredBugs}
        selectedBugs={selectedBugs}
        onSelectionChange={setSelectedBugs}
        onBugClick={handleEditBug}
        loading={loading}
      />

      {/* Modal */}
      <BugModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        bug={editingBug}
        onSave={handleSaveBug}
        onDelete={editingBug ? handleDeleteBug : undefined}
      />
    </div>
  );
}