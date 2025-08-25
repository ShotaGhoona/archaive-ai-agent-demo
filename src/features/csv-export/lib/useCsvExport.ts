"use client";
import { useState } from 'react';
import { CsvColumnConfig, UseCsvExportReturn } from '../model';

export function useCsvExport<T>(
  data: T[],
  initialColumns: Omit<CsvColumnConfig<T>, 'enabled'>[],
  defaultFilename: string,
  maxPreviewRows: number = 10
): UseCsvExportReturn<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [encoding, setEncoding] = useState<'utf-8' | 'shift_jis'>('utf-8');
  const [includeHeader, setIncludeHeader] = useState(true);
  const [columns, setColumns] = useState<CsvColumnConfig<T>[]>(
    initialColumns.map(col => ({ ...col, enabled: true }))
  );

  const handleColumnToggle = (index: number) => {
    const newColumns = [...columns];
    newColumns[index].enabled = !newColumns[index].enabled;
    setColumns(newColumns);
  };

  const toggleAllColumns = (enabled: boolean) => {
    const newColumns = columns.map(col => ({ ...col, enabled }));
    setColumns(newColumns);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    
    if (dragIndex === dropIndex) return;
    
    const newColumns = [...columns];
    const draggedColumn = newColumns[dragIndex];
    
    newColumns.splice(dragIndex, 1);
    newColumns.splice(dropIndex, 0, draggedColumn);
    
    setColumns(newColumns);
  };

  const getPreviewData = () => {
    const enabledColumns = columns.filter(col => col.enabled);
    const previewData = data.slice(0, maxPreviewRows);
    
    const headers = enabledColumns.map(col => col.label);
    const rows = previewData.map(item => 
      enabledColumns.map(col => {
        const value = item[col.key];
        if (col.formatter) {
          return col.formatter(value);
        }
        return typeof value === 'number' ? value.toString() : String(value || '');
      })
    );

    return { headers, rows };
  };

  const generateCsv = () => {
    const enabledColumns = columns.filter(col => col.enabled);
    if (enabledColumns.length === 0) return;

    let csvContent = "";
    
    // ヘッダー行
    if (includeHeader) {
      const headers = enabledColumns.map(col => col.label);
      csvContent += headers.map(header => `"${header}"`).join(",") + "\n";
    }
    
    // データ行
    data.forEach(item => {
      const row = enabledColumns.map(col => {
        const value = item[col.key];
        let formattedValue: string;
        if (col.formatter) {
          formattedValue = col.formatter(value);
        } else {
          formattedValue = typeof value === 'number' ? value.toString() : String(value || '');
        }
        return `"${formattedValue.replace(/"/g, '""')}"`;
      });
      csvContent += row.join(",") + "\n";
    });

    // ファイルダウンロード
    const blob = new Blob([csvContent], { 
      type: encoding === "shift_jis" ? "text/csv;charset=shift_jis" : "text/csv;charset=utf-8" 
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${defaultFilename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    setIsOpen(false);
  };

  const enabledCount = columns.filter(col => col.enabled).length;

  return {
    isOpen,
    setIsOpen,
    encoding,
    setEncoding,
    includeHeader,
    setIncludeHeader,
    columns,
    setColumns,
    handleColumnToggle,
    toggleAllColumns,
    handleDragStart,
    handleDragOver,
    handleDrop,
    getPreviewData,
    generateCsv,
    enabledCount,
  };
}