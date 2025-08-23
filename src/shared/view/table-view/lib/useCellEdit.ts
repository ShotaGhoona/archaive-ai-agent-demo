import { useState, useEffect, useRef, useCallback } from 'react';
import { EditingCell, EditableFields, DataTableColumn, CellContentData } from '../model';

interface UseCellEditProps<T> {
  columns: DataTableColumn<T>[];
  getRowId: (item: T) => string;
  onUpdate?: (rowId: string, field: string, value: unknown) => void;
}

export function useCellEdit<T>({ columns, getRowId, onUpdate }: UseCellEditProps<T>) {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState<unknown>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  // columns から編集可能フィールドとロックフィールドを動的に生成
  const editableFields = columns.reduce((acc, col) => {
    if (col.editable) {
      acc[col.key as string] = { 
        type: col.inputType || 'text', 
        label: col.label,
        options: col.selectOptions
      };
    }
    return acc;
  }, {} as EditableFields);

  const lockedFields = columns
    .filter(col => col.locked)
    .map(col => col.key as string);

  // 編集開始
  const startEditing = useCallback((rowId: string, field: string, currentValue: unknown) => {
    if (lockedFields.includes(field)) return;
    
    setEditingCell({ rowId, field, value: currentValue });
    setEditValue(currentValue);
  }, [lockedFields]);

  // 編集保存
  const saveEdit = useCallback(() => {
    if (!editingCell) return;
    
    const { rowId, field } = editingCell;
    onUpdate?.(rowId, field, editValue);
    setEditingCell(null);
    setEditValue('');
  }, [editingCell, editValue, onUpdate]);

  // 編集キャンセル
  const cancelEdit = useCallback(() => {
    setEditingCell(null);
    setEditValue('');
  }, []);

  // 編集中のinput要素にフォーカス
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  // セルがクリックされた時の処理
  const handleCellClick = useCallback((item: T, field: string) => {
    const rowId = getRowId(item);
    const value = (item as Record<string, unknown>)[field];
    startEditing(rowId, field, value);
  }, [startEditing, getRowId]);

  // セルの表示内容を取得
  const getCellContent = useCallback((item: T, field: string): CellContentData => {
    const rowId = getRowId(item);
    const isEditing = editingCell?.rowId === rowId && editingCell?.field === field;
    
    if (isEditing) {
      return {
        isEditing: true,
        inputRef,
        value: editValue,
        onChange: setEditValue,
        onSave: saveEdit,
        onCancel: cancelEdit,
        inputType: editableFields[field]?.type || 'text',
        selectOptions: editableFields[field]?.options
      };
    }

    return {
      isEditing: false,
      value: (item as Record<string, unknown>)[field],
      inputRef: null,
      onChange: null,
      onSave: null,
      onCancel: null,
      inputType: 'text',
      selectOptions: undefined
    };
  }, [editingCell, editValue, saveEdit, cancelEdit, editableFields, getRowId]);

  // セルのスタイルを取得
  const getCellClassName = useCallback((field: string, isEditing: boolean) => {
    let baseClass = "group relative";
    
    if (lockedFields.includes(field)) {
      baseClass += " cursor-not-allowed bg-gray-50 text-gray-500";
    } else if (isEditing) {
      baseClass += " bg-blue-50 border border-blue-200";
    } else {
      baseClass += " cursor-pointer hover:bg-blue-50 transition-colors";
    }
    
    return baseClass;
  }, [lockedFields]);

  // フィールドが編集可能かどうか
  const isEditable = useCallback((field: string) => {
    return !lockedFields.includes(field) && field in editableFields;
  }, [lockedFields, editableFields]);

  // フィールドがロックされているかどうか
  const isLocked = useCallback((field: string) => {
    return lockedFields.includes(field);
  }, [lockedFields]);

  return {
    editingCell,
    editValue,
    inputRef,
    startEditing,
    saveEdit,
    cancelEdit,
    handleCellClick,
    getCellContent,
    getCellClassName,
    isEditable,
    isLocked,
    setEditValue
  };
}