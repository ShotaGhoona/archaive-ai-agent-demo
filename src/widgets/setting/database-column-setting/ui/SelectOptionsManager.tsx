'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared';
import { Settings, Plus, Trash2 } from 'lucide-react';
import { SelectOption } from '../model';

interface SelectOptionsManagerProps {
  options: SelectOption[];
  onOptionsChange: (options: SelectOption[]) => void;
  disabled?: boolean;
}

// プリセット色パレット
const PRESET_COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red  
  '#10B981', // green
  '#F59E0B', // yellow
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#F97316', // orange
  '#6B7280', // gray
  '#1F2937', // dark gray
  '#DC2626', // dark red
];

export function SelectOptionsManager({ options = [], onOptionsChange, disabled = false }: SelectOptionsManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingOptions, setEditingOptions] = useState<SelectOption[]>(options);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [colorPickerOptionId, setColorPickerOptionId] = useState<string | null>(null);

  // 変更検知のためのuseEffect
  useEffect(() => {
    const originalOptionsString = JSON.stringify(options.sort((a, b) => a.id.localeCompare(b.id)));
    const editingOptionsString = JSON.stringify(editingOptions.sort((a, b) => a.id.localeCompare(b.id)));
    setHasChanges(originalOptionsString !== editingOptionsString);
  }, [options, editingOptions]);

  const getRandomColor = () => {
    return PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
  };

  const handleAddOption = () => {
    const newOption: SelectOption = {
      id: `option-${Date.now()}`,
      label: '新しい選択肢',
      color: getRandomColor(),
    };

    setEditingOptions(prev => [...prev, newOption]); // 末尾に追加
    setEditingOptionId(newOption.id); // 即座に編集モードに
  };

  const handleLabelChange = (optionId: string, newLabel: string) => {
    setEditingOptions(prev => prev.map(opt => 
      opt.id === optionId ? { ...opt, label: newLabel } : opt
    ));
  };

  const handleColorChange = (optionId: string, newColor: string) => {
    setEditingOptions(prev => prev.map(opt => 
      opt.id === optionId ? { ...opt, color: newColor } : opt
    ));
    setColorPickerOptionId(null);
  };

  const handleDeleteOption = (optionId: string) => {
    setEditingOptions(prev => prev.filter(opt => opt.id !== optionId));
  };

  const handleSave = () => {
    onOptionsChange(editingOptions);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setEditingOptions(options);
    setEditingOptionId(null);
    setColorPickerOptionId(null);
    setIsOpen(false);
  };

  const handleDiscardChanges = () => {
    handleCancel();
    setShowUnsavedDialog(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setEditingOptions(options);
      setEditingOptionId(null);
      setColorPickerOptionId(null);
    } else {
      // 閉じようとした時に変更があるかチェック
      if (hasChanges) {
        setShowUnsavedDialog(true);
        return; // popoverを閉じない
      }
    }
    setIsOpen(open);
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            className={`flex items-center gap-1 text-xs ${disabled ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''}`}
            disabled={disabled}
          >
            <Settings className="h-3 w-3" />
            {options.length > 0 ? `${options.length}個の選択肢` : '選択肢なし'}
          </Button>
        </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        <div className="space-y-3">
          {/* ヘッダー */}
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-sm">選択肢</span>
          </div>

          {/* 選択肢リスト */}
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {editingOptions.map((option) => (
                <div key={option.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded group">
                  <div className="flex items-center gap-2 flex-1">
                    {/* 色部分（クリックで色選択） */}
                    <Popover 
                      open={colorPickerOptionId === option.id} 
                      onOpenChange={(open) => setColorPickerOptionId(open ? option.id : null)}
                    >
                      <PopoverTrigger asChild>
                        <button
                          className="w-6 h-6 rounded-sm border border-gray-300 hover:border-gray-500 transition-colors cursor-pointer"
                          style={{ backgroundColor: option.color }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-2" side="right" align="start">
                        <div className="grid grid-cols-4 gap-1">
                          {PRESET_COLORS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                                option.color === color 
                                  ? 'border-gray-800 shadow-md' 
                                  : 'border-gray-200 hover:border-gray-400'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => handleColorChange(option.id, color)}
                            />
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    {/* ラベル部分（クリックで編集） */}
                    {editingOptionId === option.id ? (
                      <Input
                        value={option.label}
                        onChange={(e) => handleLabelChange(option.id, e.target.value)}
                        onBlur={() => setEditingOptionId(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setEditingOptionId(null);
                          }
                        }}
                        className="text-sm h-6 px-2"
                        autoFocus
                      />
                    ) : (
                      <span 
                        className="text-sm cursor-pointer hover:text-primary flex-1"
                        onClick={() => setEditingOptionId(option.id)}
                      >
                        {option.label}
                      </span>
                    )}
                  </div>
                  
                  {/* 削除ボタン */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteOption(option.id)}
                    className="h-5 w-5 p-0 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            }
          </div>

          {/* 追加ボタン */}
          <Button 
            onClick={handleAddOption}
            variant="outline"
            className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            新しい選択肢を追加
          </Button>

          <Separator />

          {/* 保存・キャンセルボタン */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={handleCancel} className="text-sm">
              キャンセル
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!hasChanges}
              className="text-sm"
            >
              保存
            </Button>
          </div>
        </div>
      </PopoverContent>
      </Popover>

      {/* 未保存の変更確認ダイアログ */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>未保存の変更があります</AlertDialogTitle>
            <AlertDialogDescription>
              選択肢に未保存の変更があります。変更を破棄して閉じますか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>戻る</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscardChanges} className="bg-red-600 hover:bg-red-700">
              変更を破棄
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}