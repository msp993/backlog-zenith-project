import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useBacklogItems, BacklogItem } from '@/hooks/useBacklogItems';
import { FilterBar } from '@/components/backlog/FilterBar';
import { BacklogTable } from '@/components/backlog/BacklogTable';
import { BacklogModal } from '@/components/backlog/BacklogModal';
import { BulkActions } from '@/components/backlog/BulkActions';

export default function Backlog() {
  const {
    items,
    loading,
    filters,
    setFilters,
    createItem,
    updateItem,
    deleteItem,
    bulkUpdateStatus
  } = useBacklogItems();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BacklogItem | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Apply filters to items
  const filteredItems = items.filter(item => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!item.title.toLowerCase().includes(searchLower) && 
          !item.description?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    return true;
  });

  const handleCreateNew = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEditItem = (item: BacklogItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleSaveItem = async (data: Partial<BacklogItem>) => {
    if (editingItem) {
      await updateItem(editingItem.id, data);
    } else {
      await createItem(data);
    }
  };

  const handleDeleteItem = async (id: string) => {
    await deleteItem(id);
  };

  const handleBulkStatusUpdate = async (status: BacklogItem['status']) => {
    setBulkLoading(true);
    try {
      await bulkUpdateStatus(selectedItems, status);
      setSelectedItems([]);
    } finally {
      setBulkLoading(false);
    }
  };

  const totalStoryPoints = filteredItems.reduce((acc, item) => acc + (item.story_points || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Product Backlog</h1>
          <p className="text-muted-foreground">Gestión de historias de usuario y tareas</p>
        </div>
        <Button onClick={handleCreateNew} className="btn-premium">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Historia
        </Button>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        totalItems={items.length}
        filteredItems={filteredItems.length}
      />

      {/* Summary */}
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="glass-card">
          {filteredItems.length} historia{filteredItems.length !== 1 ? 's' : ''}
        </Badge>
        <Badge variant="outline" className="glass-card">
          {totalStoryPoints} story points
        </Badge>
        {selectedItems.length > 0 && (
          <Badge variant="secondary">
            {selectedItems.length} seleccionada{selectedItems.length !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedItems={selectedItems}
        onClearSelection={() => setSelectedItems([])}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        loading={bulkLoading}
      />

      {/* Table */}
      <BacklogTable
        items={filteredItems}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        onItemClick={handleEditItem}
        loading={loading}
      />

      {/* Modal */}
      <BacklogModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        item={editingItem}
        onSave={handleSaveItem}
        onDelete={editingItem ? handleDeleteItem : undefined}
      />
    </div>
  );
}