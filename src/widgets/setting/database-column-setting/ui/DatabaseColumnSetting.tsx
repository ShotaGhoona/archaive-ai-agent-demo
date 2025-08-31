'use client';
import {
  Plus,
  Trash2,
  Type,
  Hash,
  Calendar,
  List,
  User,
  ToggleLeft,
  Lock,
} from 'lucide-react';
import {
  Button,
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
  TooltipTrigger,
  Switch,
} from '@/shared';
import { DatabaseColumnSettingConfig, SelectOption } from '../model';
import { SelectOptionsManager } from '../ui';

interface DatabaseColumnSettingProps {
  columns: DatabaseColumnSettingConfig[];
  onUpdateColumn: (
    id: string,
    updates: Partial<DatabaseColumnSettingConfig>,
  ) => void;
  onDeleteColumn: (id: string) => void;
  onAddColumn: () => void;
  onToggleRequired: (id: string) => void; // TODO: 必須フラグ切り替え処理
  onToggleBasicInfo: (id: string) => void; // TODO: 基本情報表示切り替え処理
  onToggleTableDisplay: (id: string) => void; // TODO: テーブル表示切り替え処理
}

export function DatabaseColumnSetting({
  columns,
  onUpdateColumn,
  onDeleteColumn,
  onAddColumn,
  onToggleRequired,
  onToggleBasicInfo,
  onToggleTableDisplay,
}: DatabaseColumnSettingProps) {
  const handleUpdate = (
    id: string,
    updates: Partial<DatabaseColumnSettingConfig>,
  ) => {
    onUpdateColumn(id, updates);
  };

  const handleDelete = (id: string) => {
    onDeleteColumn(id);
  };

  // データ型の定義
  const dataTypes = [
    {
      value: 'text',
      label: 'テキスト',
      icon: Type,
      title: 'テキスト型',
      description:
        '文字や文章を入力する項目です。製品名、部品名、コメントなどに使用します。',
    },
    {
      value: 'number',
      label: '数値',
      icon: Hash,
      title: '数値型',
      description:
        '数字を入力する項目です。受注個数、寸法、重量、価格などに使用します。',
    },
    {
      value: 'date',
      label: '日付',
      icon: Calendar,
      title: '日付型',
      description:
        '日付を入力する項目です。受注日、納期、検査日などに使用します。',
    },
    {
      value: 'select',
      label: '選択肢',
      icon: List,
      title: '選択肢型',
      description:
        '予め決められた選択肢から選ぶ項目です。進捗状況、品質ランク、優先度などに使用します。',
    },
    {
      value: 'user',
      label: '従業員',
      icon: User,
      title: '従業員型',
      description:
        '社内の担当者を選ぶ項目です。営業担当、設計担当、検査担当などに使用します。',
    },
    {
      value: 'boolean',
      label: 'ON / OFF',
      icon: ToggleLeft,
      title: 'ON/OFF型',
      description:
        'はい/いいえを選ぶ項目です。検査合格、緊急案件、完了フラグなどに使用します。',
    },
  ];

  return (
    <div className='flex flex-col'>
      {/* 項目リスト */}
      <div className='flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white'>
        {/* ヘッダー */}
        <div className='flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-3'>
          <div className='flex items-center gap-4'>
            <div className='flex w-12 items-center gap-2'>
              <span className='text-sm font-bold text-gray-900'>必須</span>
            </div>
            <div className='w-48'>
              <span className='text-sm font-bold text-gray-900'>項目名</span>
            </div>
            <div className='w-64'>
              <span className='text-sm font-bold text-gray-900'>説明文</span>
            </div>
            <div className='flex w-40 items-center gap-2'>
              <span className='text-sm font-bold text-gray-900'>型設定</span>
            </div>
          </div>
          <div className='flex flex-shrink-0 items-center gap-5'>
            <div className='flex w-32 items-center gap-2'>
              <span className='text-sm font-bold text-gray-900'>
                基本情報に表示
              </span>
            </div>
            <div className='flex w-32 items-center gap-2'>
              <span className='text-sm font-bold text-gray-900'>
                テーブルに表示
              </span>
            </div>
            <div className='flex w-12 items-center gap-2'>
              <span className='text-sm font-bold text-gray-900'>削除</span>
            </div>
          </div>
        </div>
        <div>
          {columns.map((column) => (
            <div
              key={column.id}
              className='flex items-center justify-between border-b border-gray-200 px-4 py-2 transition-colors last:border-b-0 hover:bg-gray-50'
            >
              {/* 左側グループ */}
              <div className='flex items-center gap-4'>
                {/* 必須スイッチ */}
                <div className='flex w-12 items-center justify-start'>
                  <Switch
                    checked={column.isRequired}
                    onCheckedChange={() => onToggleRequired?.(column.id)}
                  />
                </div>
                {/* 項目名 */}
                <div className='w-48'>
                  <Input
                    value={column.name}
                    onChange={(e) =>
                      handleUpdate(column.id, { name: e.target.value })
                    }
                    className={`border-0 shadow-none focus:ring-1 focus:ring-blue-500 ${column.editable === false ? 'cursor-not-allowed bg-gray-50 text-gray-600' : ''}`}
                    placeholder='項目名を入力'
                    disabled={column.editable === false}
                  />
                </div>

                {/* 説明文 */}
                <div className='w-64'>
                  <Input
                    value={column.description || ''}
                    onChange={(e) =>
                      handleUpdate(column.id, { description: e.target.value })
                    }
                    className={`border-0 shadow-none focus:ring-1 focus:ring-blue-500 ${column.editable === false ? 'cursor-not-allowed bg-gray-50 text-gray-600' : ''}`}
                    placeholder='説明文を入力'
                    disabled={column.editable === false}
                  />
                </div>

                {/* 型設定 */}
                <div className={`flex w-40 items-center gap-2 ${column.editable === false ? 'hidden' : ''}`}>
                  <Select
                    value={column.dataType}
                    onValueChange={(
                      value: DatabaseColumnSettingConfig['dataType'],
                    ) => {
                      // 型が変更された場合、selectでなければoptionsをクリア
                      handleUpdate(column.id, {
                        dataType: value,
                        ...(value !== 'select' && { options: undefined }),
                      });
                    }}
                    disabled={column.editable === false}
                  >
                    <SelectTrigger
                      className={`w-40 ${column.editable === false ? 'cursor-not-allowed bg-gray-50 text-gray-600' : ''}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dataTypes.map((dataType) => {
                        const IconComponent = dataType.icon;
                        return (
                          <Tooltip key={dataType.value} delayDuration={500}>
                            <TooltipTrigger asChild>
                              <SelectItem value={dataType.value}>
                                <div className='flex items-center gap-2'>
                                  <IconComponent className='h-4 w-4' />
                                  {dataType.label}
                                </div>
                              </SelectItem>
                            </TooltipTrigger>
                            <TooltipContent side='right' className='max-w-xs'>
                              <div className='space-y-1'>
                                <p className='text-base font-medium'>
                                  {dataType.title}
                                </p>
                                <p className='text-sm'>
                                  {dataType.description}
                                </p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* select型の場合のみオプション管理を表示 */}
                {column.dataType === 'select' && (
                  <div className={column.editable === false ? 'hidden' : ''}>
                    <SelectOptionsManager
                      options={column.options || []}
                      onOptionsChange={(options: SelectOption[]) => {
                        handleUpdate(column.id, { options });
                      }}
                      disabled={column.editable === false}
                    />
                  </div>
                )}
              </div>

              {/* 右側: 表示設定と削除ボタン */}
              <div className='flex flex-shrink-0 items-center gap-5'>
                {/* 基本情報に表示スイッチ */}
                <div className='flex w-32 items-center justify-start'>
                  <Switch
                    checked={column.showInBasicInfo}
                    onCheckedChange={() => onToggleBasicInfo?.(column.id)}
                  />
                </div>
                {/* テーブルに表示スイッチ */}
                <div className='flex w-32 items-center justify-start'>
                  <Switch
                    checked={column.showInTable}
                    onCheckedChange={() => onToggleTableDisplay?.(column.id)}
                  />
                </div>
                <div className='flex w-12 items-center justify-center'>
                  {column.editable !== false ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant='outline'
                          size='sm'
                          className='text-red-500 hover:bg-red-50 hover:text-red-600'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            項目を削除しますか？
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            「{column.name}
                            」を削除します。この操作は取り消すことができません。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>キャンセル</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(column.id)}
                            className='bg-red-600 hover:bg-red-700'
                          >
                            削除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <Button
                      variant='outline'
                      size='sm'
                      className='cursor-not-allowed text-gray-400'
                      disabled
                    >
                      <Lock className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 新規項目追加ボタン */}
        <div className='border-t border-gray-200 p-4'>
          <Button
            onClick={onAddColumn}
            variant='outline'
            className='w-full border-2 border-dashed border-gray-300 py-6 text-gray-600 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700'
          >
            <Plus className='mr-2 h-5 w-5' />
            新規項目を追加
          </Button>
        </div>
      </div>
    </div>
  );
}
