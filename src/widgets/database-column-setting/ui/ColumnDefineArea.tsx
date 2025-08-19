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
  AlertDialogTrigger
} from '@/shared/shadcnui';
import { ColumnConfig, SelectOption } from '../model/types';
import { SelectOptionsManager } from './SelectOptionsManager';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface ColumnDefineAreaProps {
  columns: ColumnConfig[];
  onUpdateColumn: (id: string, updates: Partial<ColumnConfig>) => void;
  onDeleteColumn: (id: string) => void;
  onAddColumn: () => void;
  onReorderColumns: (startIndex: number, endIndex: number) => void;
}

export function ColumnDefineArea({ 
  columns, 
  onUpdateColumn, 
  onDeleteColumn, 
  onAddColumn,
  onReorderColumns,
}: ColumnDefineAreaProps) {
  const handleUpdate = (id: string, updates: Partial<ColumnConfig>) => {
    onUpdateColumn(id, updates);
  };

  const handleDelete = (id: string) => {
    onDeleteColumn(id);
  };

  const handleDragEnd = (result: any) => {
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

  return (
    <div className="flex flex-col h-full">
      {/* 項目リスト */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto min-h-0">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="columns">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-h-full"
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
                                className={`border-0 shadow-none focus:ring-1 focus:ring-blue-500 ${
                                  column.name === '新しい項目' ? 'text-primary font-medium' : ''
                                }`}
                                placeholder="項目名を入力"
                              />
                            </div>

                            {/* 型設定 */}
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">型設定</span>
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
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">
                                    <div className="flex items-center gap-2">
                                      <Type className="h-4 w-4" />
                                      テキスト
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="number">
                                    <div className="flex items-center gap-2">
                                      <Hash className="h-4 w-4" />
                                      数値
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="date">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      日付
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="select">
                                    <div className="flex items-center gap-2">
                                      <List className="h-4 w-4" />
                                      選択肢
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="user">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      従業員
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="boolean">
                                    <div className="flex items-center gap-2">
                                      <ToggleLeft className="h-4 w-4" />
                                      ON / OFF
                                    </div>
                                  </SelectItem>
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
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">データベースに表示</span>
                              <Switch
                                checked={column.displayEnabled}
                                onCheckedChange={(checked) => handleUpdate(column.id, { displayEnabled: checked })}
                              />
                            </div>

                            {/* フィルター設定 */}
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">フィルターに表示</span>
                              <Switch
                                checked={column.filterEnabled}
                                onCheckedChange={(checked) => handleUpdate(column.id, { filterEnabled: checked })}
                              />
                            </div>
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {/* 新規項目追加ボタン */}
      <div className="flex-shrink-0 mt-4">
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
  );
}