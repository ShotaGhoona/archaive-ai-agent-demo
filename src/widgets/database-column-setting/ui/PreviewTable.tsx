import { BasicDataTable, DataTableColumn } from '@/shared/basic-data-table';
import { 
  Button, 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  Badge,
  Switch,
  Avatar,
  AvatarFallback
} from '@/shared/shadcnui';
import { ExternalLink, Table } from 'lucide-react';
import { ColumnConfig, generateSampleValue } from '../model/types';

interface PreviewTableProps {
  columns: ColumnConfig[];
}

// プレビュー用のサンプルデータ型
interface PreviewRecord {
  id: string;
  [key: string]: string | number | boolean;
}

export function PreviewTable({ columns }: PreviewTableProps) {
  // 表示対象の列のみフィルター
  const visibleColumns = columns
    .filter(col => col.displayEnabled)
    .sort((a, b) => a.order - b.order);

  // BasicDataTable用の列定義を生成
  const tableColumns: DataTableColumn<PreviewRecord>[] = [
    // 操作列を追加
    {
      key: 'actions',
      label: '操作',
      width: 80,
      sortable: false,
      editable: false,
      locked: true,
      render: () => (
        <Button size="sm" variant="outline" className="h-8">
          <ExternalLink className="h-3 w-3 mr-1" />
          開く
        </Button>
      ),
    },
    ...visibleColumns.map((col): DataTableColumn<PreviewRecord> => ({
      key: col.id,
      label: col.name,
      width: 150,
      sortable: true,
      editable: false,
      locked: true,
      sortType: col.dataType === 'number' ? 'number' : col.dataType === 'date' ? 'date' : 'string',
      render: (item, value) => {
        // select型の表示
        if (col.dataType === 'select' && col.options) {
          const option = col.options.find(opt => opt.label === String(value));
          if (option) {
            return (
              <Badge 
                variant="outline" 
                className="text-white border-0"
                style={{ backgroundColor: option.color }}
              >
                {option.label}
              </Badge>
            );
          }
        }
        
        // user型の表示
        if (col.dataType === 'user') {
          const userName = String(value);
          const initials = userName.length >= 2 ? userName.substring(0, 2) : userName.substring(0, 1);
          return (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{userName}</span>
            </div>
          );
        }
        
        // boolean型の表示
        if (col.dataType === 'boolean') {
          return (
            <Switch 
              checked={Boolean(value)} 
              disabled 
              className="data-[state=checked]:bg-primary"
            />
          );
        }
        
        // その他の型の表示
        return (
          <span className={col.dataType === 'date' ? 'font-mono' : ''}>
            {String(value)}
          </span>
        );
      },
    })),
  ];

  // サンプルデータを生成
  const sampleData: PreviewRecord[] = Array.from({ length: 10 }, (_, index) => {
    const record: PreviewRecord = { id: `sample-${index + 1}` };
    
    visibleColumns.forEach(col => {
      record[col.id] = generateSampleValue(col.dataType, col.options);
    });

    return record;
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="lg" className="flex items-center gap-2">
          <Table className="h-4 w-4" />
          テーブルプレビュー
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[50vh]">
        <div className="flex-1 my-6 min-h-0">
          <BasicDataTable
            data={sampleData}
            columns={tableColumns}
            getRowId={(item) => item.id}
            emptyMessage="表示する項目がありません"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}