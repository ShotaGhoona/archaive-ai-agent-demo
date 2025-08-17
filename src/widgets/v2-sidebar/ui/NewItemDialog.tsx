"use client";

import React, { useState } from 'react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label } from '../../../shared/shadcnui';
import { itemTypeOptions, iconColorOptions } from '../lib/constants';
import { getIconByType } from '../lib/iconUtils';
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
  const [iconColor, setIconColor] = useState('text-primary');

  const handleSubmit = () => {
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      type,
      iconColor,
      children: (type === 'folder' || type === 'project-folder') ? [] : undefined,
      parentId
    });

    setName('');
    setType('folder');
    setIconColor('text-primary');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-5xl">
        <DialogHeader>
          <DialogTitle>新しいアイテムを追加</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-6">
              <div className="flex-1 space-y-2">
                <Label htmlFor="name">名前</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="アイテム名を入力"
                />
              </div>
              <div>
                <Label htmlFor="color">アイコンカラー</Label>
                <div className="flex items-center gap-2 mt-2">
                  {iconColorOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-110 ${
                        iconColor === option.value
                          ? 'ring-2 ring-gray-800 ring-offset-2 scale-90'
                          : ''
                      } ${option.color}`}
                      onClick={() => setIconColor(option.value)}
                      title={option.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">種類</Label>
            <div className="grid grid-cols-4 auto-rows-fr gap-2">
              {itemTypeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    type === option.value
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200'
                  } ${option.colSpan === 2 ? 'col-span-2' : 'col-span-1'} ${
                    option.rowSpan === 2 ? 'row-span-2' : 'row-span-1'
                  }`}
                  onClick={() => setType(option.value as V2SidebarItem['type'])}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={iconColor}>{getIconByType(option.value)}</span>
                    <div className="font-medium text-sm">{option.label}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
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