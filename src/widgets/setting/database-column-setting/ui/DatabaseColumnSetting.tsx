"use client";
import { Plus, GripVertical, Trash2, Type, Hash, Calendar, List, User, ToggleLeft } from 'lucide-react';
import { 
  Button, 
  Switch, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
  Input,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/shared';
import { ColumnConfig, SelectOption } from '../model';
import { SelectOptionsManager } from '../ui';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface DatabaseColumnSettingProps {
  columns: ColumnConfig[];
  onUpdateColumn: (id: string, updates: Partial<ColumnConfig>) => void;
  onDeleteColumn: (id: string) => void;
  onAddColumn: () => void;
  onReorderColumns: (startIndex: number, endIndex: number) => void;
}

export function DatabaseColumnSetting({ 
  columns, 
  onUpdateColumn, 
  onDeleteColumn, 
  onAddColumn,
  onReorderColumns,
}: DatabaseColumnSettingProps) {
  const handleUpdate = (id: string, updates: Partial<ColumnConfig>) => {
    onUpdateColumn(id, updates);
  };

  const handleDelete = (id: string) => {
    onDeleteColumn(id);
  };

  const handleDragEnd = (result: { destination?: { index: number } | null; source: { index: number } }) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex !== destinationIndex) {
      onReorderColumns(sourceIndex, destinationIndex);
    }
  };

  const sortedColumns = columns.sort((a, b) => a.order - b.order);

  // データ型の定義
  const dataTypes = [
    {
      value: 'text',
      label: 'テキスト',
      icon: Type,
      title: "テキスト型",
      description: "文字や文章を入力する項目です。製品名、部品名、コメントなどに使用します。"
    },
    {
      value: 'number',
      label: '数値',
      icon: Hash,
      title: "数値型", 
      description: "数字を入力する項目です。受注個数、寸法、重量、価格などに使用します。"
    },
    {
      value: 'date',
      label: '日付',
      icon: Calendar,
      title: "日付型",
      description: "日付を入力する項目です。受注日、納期、検査日などに使用します。"
    },
    {
      value: 'select',
      label: '選択肢',
      icon: List,
      title: "選択肢型",
      description: "予め決められた選択肢から選ぶ項目です。進捗状況、品質ランク、優先度などに使用します。"
    },
    {
      value: 'user',
      label: '従業員',
      icon: User,
      title: "従業員型",
      description: "社内の担当者を選ぶ項目です。営業担当、設計担当、検査担当などに使用します。"
    },
    {
      value: 'boolean',
      label: 'ON / OFF',
      icon: ToggleLeft,
      title: "ON/OFF型",
      description: "はい/いいえを選ぶ項目です。検査合格、緊急案件、完了フラグなどに使用します。"
    }
  ];

  return (
    <div className="flex flex-col">
      {/* 項目リスト */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-6"></div> {/* ドラッグハンドル用スペース */}
            <div className="w-48">
              <span className="text-sm font-medium text-gray-700">項目名</span>
            </div>
            <div className="w-64">
              <span className="text-sm font-medium text-gray-700">説明文</span>
            </div>
            <div className="w-40 flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">型設定</span>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-5">
            <div className="w-32 flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">製品ページに表示</span>
            </div>
            <div className="w-32 flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">図面テーブルに表示</span>
            </div>
            <div className="w-12 flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">削除</span>
            </div>
          </div>
        </div>
        <div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="columns">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {sortedColumns.map((column, index) => (
                    <Draggable key={column.id} draggableId={column.id} index={index}>
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center justify-between px-4 py-2 transition-colors border-b border-gray-200 last:border-b-0 ${
                            snapshot.isDragging ? 'bg-blue-50 shadow-lg' : 'hover:bg-gray-50'
                          }`}
                        >
                          {/* 左側グループ */}
                          <div className="flex items-center gap-4">
                            {/* ドラッグハンドル */}
                            <div 
                              className="flex items-center gap-2 text-gray-400"
                              {...provided.dragHandleProps}
                            >
                              <GripVertical className={`h-4 w-4 ${snapshot.isDragging ? 'cursor-grabbing' : 'cursor-grab'}`} />
                            </div>

                            {/* 項目名 */}
                            <div className="w-48">
                              <Input
                                value={column.name}
                                onChange={(e) => handleUpdate(column.id, { name: e.target.value })}
                                className="border-0 shadow-none focus:ring-1 focus:ring-blue-500"
                                placeholder="項目名を入力"
                              />
                            </div>

                            {/* 説明文 */}
                            <div className="w-64">
                              <Input
                                value={column.description || ''}
                                onChange={(e) => handleUpdate(column.id, { description: e.target.value })}
                                className="border-0 shadow-none focus:ring-1 focus:ring-blue-500"
                                placeholder="説明文を入力"
                              />
                            </div>

                            {/* 型設定 */}
                            <div className="w-40 flex items-center gap-2">
                              <Select
                                value={column.dataType}
                                onValueChange={(value: ColumnConfig['dataType']) => {
                                  // 型が変更された場合、selectでなければoptionsをクリア
                                  handleUpdate(column.id, { 
                                    dataType: value,
                                    ...(value !== 'select' && { options: undefined })
                                  });
                                }}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {/* <TooltipProvider> */}
                                    {dataTypes.map((dataType) => {
                                      const IconComponent = dataType.icon;
                                      return (
                                        <Tooltip key={dataType.value} delayDuration={500}>
                                          <TooltipTrigger asChild>
                                            <SelectItem value={dataType.value}>
                                              <div className="flex items-center gap-2">
                                                <IconComponent className="h-4 w-4" />
                                                {dataType.label}
                                              </div>
                                            </SelectItem>
                                          </TooltipTrigger>
                                          <TooltipContent side="right" className="max-w-xs">
                                            <div className="space-y-1">
                                              <p className="text-base font-medium">{dataType.title}</p>
                                              <p className="text-sm">{dataType.description}</p>
                                            </div>
                                          </TooltipContent>
                                        </Tooltip>
                                      );
                                    })}
                                  {/* </TooltipProvider> */}
                                </SelectContent>
                              </Select>
                              
                            </div>
                            {/* select型の場合のみオプション管理を表示 */}
                            {column.dataType === 'select' && (
                              <SelectOptionsManager
                                options={column.options || []}
                                onOptionsChange={(options: SelectOption[]) => {
                                  handleUpdate(column.id, { options });
                                }}
                              />
                            )}
                          </div>

                          {/* 右側: 削除ボタン */}
                          <div className="flex-shrink-0 flex items-center gap-5">
                            {/* 表示設定 */}
                            <div className="w-32 flex items-center justify-start">
                              <Switch
                                checked={column.displayEnabled}
                              />
                            </div>

                            {/* フィルター設定 */}
                            <div className="w-32 flex items-center justify-start">
                              <Switch
                                checked={column.filterEnabled}
                              />
                            </div>
                            <div className="w-12 flex items-center justify-center">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>項目を削除しますか？</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    「{column.name}」を削除します。この操作は取り消すことができません。
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(column.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    削除
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        
        {/* 新規項目追加ボタン */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={onAddColumn}
            variant="outline"
            className="w-full py-6 border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50"
          >
            <Plus className="h-5 w-5 mr-2" />
            新規項目を追加
          </Button>
        </div>
      </div>
    </div>
  );
}