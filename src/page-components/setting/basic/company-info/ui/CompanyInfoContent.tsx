'use client';

import { useState, useRef } from 'react';
import { Upload, Save } from 'lucide-react';
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared';
import { useUnsavedChanges } from '../lib';

// 都道府県リスト
const PREFECTURES = [
  '北海道',
  '青森県',
  '岩手県',
  '宮城県',
  '秋田県',
  '山形県',
  '福島県',
  '茨城県',
  '栃木県',
  '群馬県',
  '埼玉県',
  '千葉県',
  '東京都',
  '神奈川県',
  '新潟県',
  '富山県',
  '石川県',
  '福井県',
  '山梨県',
  '長野県',
  '岐阜県',
  '静岡県',
  '愛知県',
  '三重県',
  '滋賀県',
  '京都府',
  '大阪府',
  '兵庫県',
  '奈良県',
  '和歌山県',
  '鳥取県',
  '島根県',
  '岡山県',
  '広島県',
  '山口県',
  '徳島県',
  '香川県',
  '愛媛県',
  '高知県',
  '福岡県',
  '佐賀県',
  '長崎県',
  '熊本県',
  '大分県',
  '宮崎県',
  '鹿児島県',
  '沖縄県',
];

export function CompanyInfoContent() {
  const [hasChanges, setHasChanges] = useState(false);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [stampImage, setStampImage] = useState<string | null>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const stampInputRef = useRef<HTMLInputElement>(null);

  const { executeNavigation, cancelNavigation } = useUnsavedChanges({
    hasChanges,
    onShowDialog: () => setShowUnsavedDialog(true),
    onHideDialog: () => setShowUnsavedDialog(false),
  });

  const handleInputChange = () => {
    setHasChanges(true);
  };

  const handleImageUpload = (file: File, type: 'logo' | 'stamp') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'logo') {
        setLogoImage(result);
      } else {
        setStampImage(result);
      }
      setHasChanges(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // 保存処理
    setHasChanges(false);
  };

  const handleDiscardChanges = () => {
    setHasChanges(false);
    executeNavigation();
  };

  const handleCancelNavigation = () => {
    cancelNavigation();
  };

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-900'>組織情報</h1>
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          className='flex items-center gap-2'
        >
          <Save className='h-4 w-4' />
          設定を保存
        </Button>
      </div>

      {/* 会社情報 */}
      <div className='space-y-4'>
        <div>
          <Label>会社情報</Label>
          <Input type='text' defaultValue='' onChange={handleInputChange} />
        </div>

        <div>
          <Label>インボイス番号</Label>
          <Input type='text' defaultValue='' onChange={handleInputChange} />
        </div>
      </div>

      {/* 住所情報 */}
      <div className='space-y-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div>
            <Label>郵便番号</Label>
            <div className='flex items-center gap-2'>
              <Input
                type='text'
                defaultValue=''
                onChange={handleInputChange}
                className='flex-1'
              />
              <button className='text-sm text-blue-600 hover:underline'>
                郵便番号から住所を検索
              </button>
            </div>
          </div>

          <div>
            <Label>都道府県</Label>
            <Select onValueChange={() => handleInputChange()}>
              <SelectTrigger>
                <SelectValue placeholder='選択してください' />
              </SelectTrigger>
              <SelectContent>
                {PREFECTURES.map((prefecture) => (
                  <SelectItem key={prefecture} value={prefecture}>
                    {prefecture}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>市区町村</Label>
            <Input type='text' defaultValue='' onChange={handleInputChange} />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <Label>番地以下</Label>
            <Input type='text' defaultValue='' onChange={handleInputChange} />
          </div>

          <div>
            <Label>建物名</Label>
            <Input type='text' defaultValue='' onChange={handleInputChange} />
          </div>
        </div>
      </div>

      {/* 連絡先情報 */}
      <div className='space-y-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <Label>電話番号</Label>
            <Input type='text' defaultValue='' onChange={handleInputChange} />
          </div>

          <div>
            <Label>メールアドレス</Label>
            <Input type='email' defaultValue='' onChange={handleInputChange} />
          </div>
        </div>

        <div>
          <Label>WEBサイト</Label>
          <Input type='url' defaultValue='' onChange={handleInputChange} />
        </div>
      </div>

      {/* ロゴと印鑑 */}
      <div className='space-y-4'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div>
            <Label>ロゴ</Label>
            <div className='relative'>
              {!logoImage ? (
                <div
                  className='cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-colors hover:bg-gray-100'
                  onClick={() => logoInputRef.current?.click()}
                >
                  <div className='flex h-32 flex-col items-center justify-center'>
                    <Upload className='mb-2 h-8 w-8 text-gray-400' />
                    <p className='text-sm text-gray-500'>
                      クリックして画像をアップロード
                    </p>
                  </div>
                </div>
              ) : (
                <div className='rounded-lg border-2 border-gray-300 bg-white p-4 text-center'>
                  <div className='mb-4 flex h-32 flex-col items-center justify-center'>
                    <img
                      src={logoImage}
                      alt='ロゴ'
                      className='max-h-full max-w-full object-contain'
                    />
                  </div>
                  <Button
                    variant='outline'
                    onClick={() => logoInputRef.current?.click()}
                    className='flex items-center gap-2'
                  >
                    <Upload className='h-4 w-4' />
                    画像を変更
                  </Button>
                </div>
              )}
              <input
                ref={logoInputRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, 'logo');
                }}
              />
            </div>
          </div>

          <div>
            <Label>印鑑</Label>
            <div className='relative'>
              {!stampImage ? (
                <div
                  className='cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-colors hover:bg-gray-100'
                  onClick={() => stampInputRef.current?.click()}
                >
                  <div className='flex h-32 flex-col items-center justify-center'>
                    <Upload className='mb-2 h-8 w-8 text-gray-400' />
                    <p className='text-sm text-gray-500'>
                      クリックして画像をアップロード
                    </p>
                  </div>
                </div>
              ) : (
                <div className='rounded-lg border-2 border-gray-300 bg-white p-4 text-center'>
                  <div className='mb-4 flex h-32 flex-col items-center justify-center'>
                    <img
                      src={stampImage}
                      alt='印鑑'
                      className='max-h-full max-w-full object-contain'
                    />
                  </div>
                  <Button
                    variant='outline'
                    onClick={() => stampInputRef.current?.click()}
                    className='flex items-center gap-2'
                  >
                    <Upload className='h-4 w-4' />
                    画像を変更
                  </Button>
                </div>
              )}
              <input
                ref={stampInputRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, 'stamp');
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 未保存の変更確認ダイアログ */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>未保存の変更があります</AlertDialogTitle>
            <AlertDialogDescription>
              組織情報に未保存の変更があります。変更を破棄してページを離れますか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelNavigation}>
              戻る
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDiscardChanges}
              className='bg-red-600 hover:bg-red-700'
            >
              変更を破棄
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
