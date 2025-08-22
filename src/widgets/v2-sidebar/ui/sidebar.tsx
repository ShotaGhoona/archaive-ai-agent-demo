"use client";

import React, { useState } from 'react';
import { ChevronRight, Plus, MoreVertical, Edit, Trash2, ChevronLeft, GripVertical } from 'lucide-react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared';
import sidebarDataJson from '../init-data/v2-sidebar.json';
import { V2SidebarItem, V2SidebarProps, Column } from '../model';
import { NewItemDialog } from '../ui';
import { generateId, addItemToTree, deleteItemFromTree, handleItemClick, handleColumnToggle, updateColumnsAfterAdd, updateColumnsAfterDelete, handleDragStart, handleDragOver, handleDrop, DragDropState, getIconByType } from '../lib';

export const V2Sidebar: React.FC<V2SidebarProps> = () => {
  const defaultData = sidebarDataJson as V2SidebarItem[];
  const [sidebarData, setSidebarData] = useState<V2SidebarItem[]>(defaultData);
  const [columns, setColumns] = useState<Column[]>([
    { id: 'root', items: defaultData, isCollapsed: false }
  ]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addParentId, setAddParentId] = useState<string>('');
  const [dragState, setDragState] = useState<DragDropState>({
    draggedItemIndex: null,
    draggedColumnIndex: null
  });

  const onItemClick = (item: V2SidebarItem, columnIndex: number) => {
    const newColumns = handleItemClick(item, columnIndex, columns);
    setColumns(newColumns);
  };

  const onColumnToggle = (columnIndex: number) => {
    const newColumns = handleColumnToggle(columnIndex, columns);
    setColumns(newColumns);
  };

  const addItem = (newItem: Omit<V2SidebarItem, 'id'>) => {
    const itemWithId = { ...newItem, id: generateId() };
    const newSidebarData = addItemToTree(sidebarData, itemWithId, addParentId);
    setSidebarData(newSidebarData);
    
    const newColumns = updateColumnsAfterAdd(columns, newSidebarData, addParentId);
    setColumns(newColumns);
  };

  const handleItemAdd = (parentId: string) => {
    setAddParentId(parentId);
    setAddDialogOpen(true);
  };

  const handleItemEdit = (id: string) => {
    console.log('編集:', id);
  };

  const handleItemDelete = (id: string) => {
    const newSidebarData = deleteItemFromTree(sidebarData, id);
    setSidebarData(newSidebarData);
    
    const newColumns = updateColumnsAfterDelete(columns, newSidebarData);
    setColumns(newColumns);
  };

  const resetDragState = () => {
    setDragState({ draggedItemIndex: null, draggedColumnIndex: null });
  };

  const onDragStart = (e: React.DragEvent, itemIndex: number, columnIndex: number) => {
    handleDragStart(e, itemIndex, columnIndex, setDragState);
  };

  const onDrop = (e: React.DragEvent, targetIndex: number, columnIndex: number) => {
    handleDrop(
      e,
      targetIndex,
      columnIndex,
      dragState,
      columns,
      sidebarData,
      setColumns,
      setSidebarData,
      resetDragState
    );
  };

  return (
    <TooltipProvider>
      <div className="bg-gray-50 flex" style={{ height: 'calc(100vh - 45px)' }}>
      {columns.map((column, index) => {
        const isCollapsed = column.isCollapsed;
        
        return (
          <div key={column.id} className={`${isCollapsed ? 'w-12' : 'w-64'} bg-white border-r border-gray-200 flex flex-col`} style={{ height: 'calc(100vh - 45px)' }}>
            {/* Header */}
            <div className="p-3 border-b border-gray-200 flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {column.parentItem && (
                    <>
                      <div className={`${column.parentItem.iconColor} flex-shrink-0`}>
                        {getIconByType(column.parentItem.type)}
                      </div>
                      <span className="font-medium text-sm truncate">{column.parentItem.name}</span>
                    </>
                  )}
                  {!column.parentItem && (
                    <span className="font-medium text-sm">Root</span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => onColumnToggle(index)}
                  title={isCollapsed ? "カラムを開く" : "カラムを閉じる"}
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-3 h-3" />
                  ) : (
                    <ChevronLeft className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-2">
              {/* Add New Item Button */}
              <div 
                className={`flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer group rounded h-8 border-1 border-dashed border-gray-300 mb-2 ${
                  isCollapsed ? 'justify-center' : ''
                }`}
                onClick={() => handleItemAdd(column.parentItem?.id || '')}
              >
                <div className="flex-shrink-0 text-gray-400">
                  <Plus className="w-4 h-4" />
                </div>
                {!isCollapsed && (
                  <span className="flex-1 text-xs text-gray-500">アイテムを追加</span>
                )}
              </div>
              
              {column.items.map((item, itemIndex) => {
                const itemElement = (
                  <div
                    key={item.id}
                    draggable={!isCollapsed}
                    onDragStart={(e) => onDragStart(e, itemIndex, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => onDrop(e, itemIndex, index)}
                    className={`flex items-center gap-2 p-2 cursor-pointer group rounded h-10 transition-colors relative ${
                      column.selectedItemId === item.id
                        ? 'bg-primary/10 hover:bg-primary/15'
                        : 'hover:bg-gray-100'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    onClick={() => onItemClick(item, index)}
                  >
                    <div className={`flex-shrink-0 ${item.iconColor} ${!isCollapsed ? 'group-hover:hidden' : ''}`}>
                      {getIconByType(item.type)}
                    </div>
                    {!isCollapsed && (
                      <div className="flex-shrink-0 text-gray-400 hidden group-hover:block">
                        <GripVertical className="w-4 h-4" />
                      </div>
                    )}
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-sm truncate min-w-0">{item.name}</span>
                        
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 absolute right-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 bg-white"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleItemEdit(item.id)}>
                                <Edit className="w-4 h-4 mr-2" />
                                編集
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleItemDelete(item.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                削除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </>
                    )}
                  </div>
                );

                if (isCollapsed) {
                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        {itemElement}
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return itemElement;
              })}
            </div>
          </div>
        );
      })}
      
      <NewItemDialog
        isOpen={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={addItem}
        parentId={addParentId}
      />
      </div>
    </TooltipProvider>
  );
};