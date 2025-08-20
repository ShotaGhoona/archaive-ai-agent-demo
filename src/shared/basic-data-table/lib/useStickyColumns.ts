import React from 'react';
import { DataTableColumn } from '../model';

interface StickyStyleOptions {
  isHeader?: boolean;
}

export function useStickyColumns() {
  const getStickyStyle = <T>(
    column: DataTableColumn<T>,
    getColumnWidth: (field: string) => number,
    options: StickyStyleOptions = {}
  ): React.CSSProperties => {
    const { isHeader = false } = options;
    
    const style: React.CSSProperties = {
      width: getColumnWidth(column.key as string),
      minWidth: getColumnWidth(column.key as string)
    };
    
    if (column.stickyLeft !== undefined) {
      style.position = 'sticky';
      style.left = `${column.stickyLeft}px`;
      style.zIndex = isHeader ? 40 : 30;
      style.backgroundColor = 'white';
    } else if (column.stickyRight !== undefined) {
      style.position = 'sticky';
      style.right = `${column.stickyRight}px`;
      style.zIndex = isHeader ? 40 : 30;
      style.backgroundColor = 'white';
    }
    
    return style;
  };

  return { getStickyStyle };
}