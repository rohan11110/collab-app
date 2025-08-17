import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Icon from '../AppIcon';

const DashboardToolbar = ({ 
  searchQuery = '', 
  onSearchChange, 
  viewMode = 'grid', 
  onViewModeChange,
  sortBy = 'modified',
  onSortChange,
  filterBy = 'all',
  onFilterChange,
  selectedCount = 0,
  onBulkAction,
  onCreateDocument
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const viewModeOptions = [
    { value: 'grid', label: 'Grid View', icon: 'Grid3X3' },
    { value: 'list', label: 'List View', icon: 'List' },
  ];

  const sortOptions = [
    { value: 'modified', label: 'Last Modified' },
    { value: 'created', label: 'Date Created' },
    { value: 'name', label: 'Name' },
    { value: 'size', label: 'Size' },
  ];

  const filterOptions = [
    { value: 'all', label: 'All Documents' },
    { value: 'owned', label: 'Owned by Me' },
    { value: 'shared', label: 'Shared with Me' },
    { value: 'recent', label: 'Recent' },
    { value: 'starred', label: 'Starred' },
  ];

  const bulkActions = [
    { value: 'share', label: 'Share', icon: 'Share2' },
    { value: 'move', label: 'Move', icon: 'FolderOpen' },
    { value: 'duplicate', label: 'Duplicate', icon: 'Copy' },
    { value: 'delete', label: 'Delete', icon: 'Trash2' },
  ];

  return (
    <div className="bg-background border-b border-border">
      <div className="p-4 space-y-4">
        {/* Main Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left Side - Search and Create */}
          <div className="flex items-center space-x-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e?.target?.value)}
                className="pl-10"
              />
              <Icon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
            </div>
            <Button
              variant="default"
              onClick={onCreateDocument}
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
              className="btn-press whitespace-nowrap"
            >
              New Doc
            </Button>
          </div>

          {/* Right Side - View Controls */}
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              {viewModeOptions?.map((option) => (
                <Button
                  key={option?.value}
                  variant={viewMode === option?.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewModeChange?.(option?.value)}
                  iconName={option?.icon}
                  className="btn-press"
                />
              ))}
            </div>

            {/* Filters Toggle */}
            <Button
              variant={showFilters ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              iconName="Filter"
              iconPosition="left"
              iconSize={16}
              className="btn-press"
            >
              Filters
            </Button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedCount > 0 && (
          <div className="flex items-center justify-between p-3 bg-accent/10 border border-accent/20 rounded-lg animate-fade-in-backdrop">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-foreground">
                {selectedCount} document{selectedCount !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-1">
                {bulkActions?.map((action) => (
                  <Button
                    key={action?.value}
                    variant="ghost"
                    size="sm"
                    onClick={() => onBulkAction?.(action?.value)}
                    iconName={action?.icon}
                    iconPosition="left"
                    iconSize={14}
                    className={`btn-press ${action?.value === 'delete' ? 'text-error hover:text-error' : ''}`}
                  >
                    {action?.label}
                  </Button>
                ))}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBulkAction?.('clear')}
              iconName="X"
              className="btn-press"
            />
          </div>
        )}

        {/* Extended Filters */}
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-surface rounded-lg border border-border animate-fade-in-backdrop">
            <div className="flex-1">
              <Select
                label="Filter by"
                options={filterOptions}
                value={filterBy}
                onChange={(value) => onFilterChange?.(value)}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <Select
                label="Sort by"
                options={sortOptions}
                value={sortBy}
                onChange={(value) => onSortChange?.(value)}
                className="w-full"
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onFilterChange?.('all');
                  onSortChange?.('modified');
                }}
                iconName="RotateCcw"
                iconPosition="left"
                iconSize={14}
                className="btn-press"
              >
                Reset
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardToolbar;