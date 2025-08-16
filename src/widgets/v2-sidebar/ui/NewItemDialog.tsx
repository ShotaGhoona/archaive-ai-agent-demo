"use client";

import React, { useState } from 'react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label } from '../../../shared/shadcnui';
import { itemTypeOptions, iconColorOptions } from '../init-data/v2-sidebar';
import { V2SidebarItem } from '../model/types';

interface NewItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<V2SidebarItem, 'id'>) => void;
  parentId?: string;
}

export const NewItemDialog: React.FC<NewItemDialogProps> = ({ isOpen, onClose, onAdd, parentId }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<V2SidebarItem['type']>('folder');
  const [iconColor, setIconColor] = useState('text-gray-600');

  const handleSubmit = () => {
    if (!name.trim()) return;

    const selectedType = itemTypeOptions.find(option => option.value === type);
    if (!selectedType) return;

    onAdd({
      name: name.trim(),
      type,
      icon: selectedType.icon,
      iconColor,
      children: type === 'folder' ? [] : undefined,
      parentId
    });

    setName('');
    setType('folder');
    setIconColor('text-gray-600');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-7xl">
        <DialogHeader>
          <DialogTitle>新しいアイテムを追加</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="アイテム名を入力"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">種類</Label>
            <div className="grid grid-cols-4 gap-2">
              {itemTypeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    type === option.value
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200'
                  }`}
                  onClick={() => setType(option.value as V2SidebarItem['type'])}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={iconColor}>{option.icon}</span>
                    <div className="font-medium text-sm">{option.label}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">アイコンカラー</Label>
            <div className="grid grid-cols-3 gap-2">
              {iconColorOptions.map((option) => (
                <div
                  key={option.value}
                  className={`p-2 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 flex items-center gap-2 ${
                    iconColor === option.value
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200'
                  }`}
                  onClick={() => setIconColor(option.value)}
                >
                  <div className={`w-4 h-4 rounded ${option.color}`} />
                  <span className="text-sm">{option.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button onClick={handleSubmit} disabled={!name.trim()}>
              追加
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};