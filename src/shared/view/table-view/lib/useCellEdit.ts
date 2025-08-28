"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { EditingCell, DataTableColumn, CellContentData } from '../model';

interface UseCellEditProps<T> {
  columns: DataTableColumn<T>[];
  getRowId: (item: T) => string;
  onUpdate?: (rowId: string, field: string, value: unknown) => void;
}

export function useCellEdit<T>({ columns, getRowId, onUpdate }: UseCellEditProps<T>) {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState<unknown>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 編集開始
  const startEditing = useCallback((rowId: string, field: string, currentValue: unknown) => {
    const column = columns.find(col => col.key === field);
    
    // ロックされた列または編集不可の列はスキップ
    if (!column || column.locked || !column.editable) {
      return;
    }
    
    setEditingCell({ rowId, field, value: currentValue });
    setEditValue(currentValue);
  }, [columns]);

  // 編集保存
  const saveEdit = useCallback(() => {
    if (!editingCell || !onUpdate) {
      setEditingCell(null);
      setEditValue('');
      return;
    }
    
    const { rowId, field } = editingCell;
    onUpdate(rowId, field, editValue);
    setEditingCell(null);
    setEditValue('');
  }, [editingCell, editValue, onUpdate]);

  // 編集キャンセル
  const cancelEdit = useCallback(() => {
    setEditingCell(null);
    setEditValue('');
  }, []);

  // 編集中の要素にフォーカス
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  // セルクリック処理
  const handleCellClick = useCallback((item: T, field: string) => {
    const rowId = getRowId(item);
    const value = (item as Record<string, unknown>)[field];
    startEditing(rowId, field, value);
  }, [startEditing, getRowId]);

  // セルの内容データを取得
  const getCellContent = useCallback((item: T, field: string): CellContentData => {
    const rowId = getRowId(item);
    const isEditing = editingCell?.rowId === rowId && editingCell?.field === field;
    const column = columns.find(col => col.key === field);
    
    if (isEditing) {
      return {
        isEditing: true,
        inputRef,
        value: editValue,
        onChange: setEditValue,
        onSave: saveEdit,
        onCancel: cancelEdit,
        inputType: column?.inputType || 'text',
        selectOptions: column?.selectOptions
      };
    }

    return {
      isEditing: false,
      value: (item as Record<string, unknown>)[field],
      inputRef: null,
      onChange: null,
      onSave: null,
      onCancel: null,
      inputType: column?.inputType || 'text',
      selectOptions: column?.selectOptions
    };
  }, [editingCell, editValue, saveEdit, cancelEdit, columns, getRowId]);

  // セルのCSSクラスを取得
  const getCellClassName = useCallback((field: string, isEditing: boolean) => {
    const column = columns.find(col => col.key === field);
    let baseClass = "group relative";
    
    if (column?.locked) {
      baseClass += " cursor-not-allowed bg-gray-50 text-gray-500";
    } else if (isEditing) {
      baseClass += " bg-blue-50 border border-blue-200";
    } else if (column?.editable) {
      baseClass += " cursor-pointer hover:bg-blue-50 transition-colors";
    }
    
    return baseClass;
  }, [columns]);

  // フィールドが編集可能かチェック
  const isEditable = useCallback((field: string) => {
    const column = columns.find(col => col.key === field);
    return column ? column.editable && !column.locked : false;
  }, [columns]);

  // フィールドがロックされているかチェック
  const isLocked = useCallback((field: string) => {
    const column = columns.find(col => col.key === field);
    return column ? column.locked : false;
  }, [columns]);

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