'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared';
import { Plus } from 'lucide-react';
import { DirectoryBaseDataInterface } from '@/dummy-data-er-fix/project';

interface CreateProjectDialogProps {
  onSubmit?: (
    project: Omit<
      DirectoryBaseDataInterface,
      'id' | 'ulid' | 'updated_by_name' | 'updated_at' | 'created_by_name' | 'created_at'
    >,
  ) => void;
  buttonText?: string;
  buttonVariant?:
    | 'default'
    | 'outline'
    | 'secondary'
    | 'destructive'
    | 'ghost'
    | 'link';
}

export function CreateProjectDialog({
  onSubmit,
  buttonText = '新規案件登録',
  buttonVariant = 'default',
}: CreateProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '株式会社アルカイブ',
    directory_type_name: '案件',
    customer_name: '',
    name: '',
    directory_custom_items: {
      '担当者': { value: '', type: 'user' },
      '回答期限': { value: '', type: 'date' },
      '作業完了日': { value: '', type: 'date' },
      '納品期限': { value: '', type: 'date' },
      '受注日': { value: '', type: 'date' },
      '案件ステータス': { value: '問い合わせ', color: 'purple', type: 'select' },
      '見積書ステータス': { value: '未提出', color: 'red', type: 'select' },
      '納品書ステータス': { value: '未対応', color: 'gray', type: 'select' },
    },
    remarks: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = '顧客名は必須です';
    }
    if (!formData.name.trim()) {
      newErrors.name = '案件名は必須です';
    }
    if (!formData.directory_custom_items['担当者'].value.trim()) {
      newErrors.assignee = '担当者は必須です';
    }
    if (!formData.directory_custom_items['回答期限'].value) {
      newErrors.responseDeadline = '回答期日は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSubmit?.(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      company_name: '株式会社アルカイブ',
      directory_type_name: '案件',
      customer_name: '',
      name: '',
      directory_custom_items: {
        '担当者': { value: '', type: 'user' },
        '回答期限': { value: '', type: 'date' },
        '作業完了日': { value: '', type: 'date' },
        '納品期限': { value: '', type: 'date' },
        '受注日': { value: '', type: 'date' },
        '案件ステータス': { value: '問い合わせ', color: 'purple', type: 'select' },
        '見積書ステータス': { value: '未提出', color: 'red', type: 'select' },
        '納品書ステータス': { value: '未対応', color: 'gray', type: 'select' },
      },
      remarks: '',
    });
    setErrors({});
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant}
          className='bg-primary hover:bg-primary/90 h-10 px-4 py-2 font-medium text-white'
        >
          <Plus className='mr-2 h-4 w-4' />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Plus className='text-primary h-5 w-5' />
            新規案件登録
          </DialogTitle>
        </DialogHeader>

        <div className='grid grid-cols-6 gap-4 py-4'>
          {/* 基本情報 */}
          <div className='col-span-3 space-y-2'>
            <Label htmlFor='customerName'>
              顧客名 <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='customerName'
              value={formData.customer_name}
              onChange={(e) =>
                handleInputChange('customer_name', e.target.value)
              }
              placeholder='株式会社〇〇'
              className={errors.customer_name ? 'border-red-500' : ''}
            />
            {errors.customer_name && (
              <p className='text-xs text-red-500'>{errors.customer_name}</p>
            )}
          </div>

          <div className='col-span-3 space-y-2'>
            <Label htmlFor='name'>
              案件名 <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='name'
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder='〇〇_案件名'
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className='text-xs text-red-500'>{errors.name}</p>
            )}
          </div>

          <div className='col-span-3 space-y-2'>
            <Label htmlFor='assignee'>
              担当者 <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='assignee'
              value={formData.directory_custom_items['担当者'].value}
              onChange={(e) => {
                const newCustomItems = { ...formData.directory_custom_items };
                newCustomItems['担当者'].value = e.target.value;
                setFormData(prev => ({ ...prev, directory_custom_items: newCustomItems }));
              }}
              placeholder='田中太郎'
              className={errors.assignee ? 'border-red-500' : ''}
            />
            {errors.assignee && (
              <p className='text-xs text-red-500'>{errors.assignee}</p>
            )}
          </div>

          {/* 日程 */}
          <div className='col-span-3 space-y-2'>
            <Label htmlFor='responseDeadline'>
              回答期日 <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='responseDeadline'
              type='date'
              value={formData.directory_custom_items['回答期限'].value}
              onChange={(e) => {
                const newCustomItems = { ...formData.directory_custom_items };
                newCustomItems['回答期限'].value = e.target.value;
                setFormData(prev => ({ ...prev, directory_custom_items: newCustomItems }));
              }}
              className={errors.responseDeadline ? 'border-red-500' : ''}
            />
            {errors.responseDeadline && (
              <p className='text-xs text-red-500'>{errors.responseDeadline}</p>
            )}
          </div>

          <div className='col-span-3 space-y-2'>
            <Label htmlFor='deliveryDeadline'>納品期日</Label>
            <Input
              id='deliveryDeadline'
              type='date'
              value={formData.directory_custom_items['納品期限'].value}
              onChange={(e) => {
                const newCustomItems = { ...formData.directory_custom_items };
                newCustomItems['納品期限'].value = e.target.value;
                setFormData(prev => ({ ...prev, directory_custom_items: newCustomItems }));
              }}
            />
          </div>

          <div className='col-span-3 space-y-2'>
            <Label htmlFor='workCompleteDate'>作業完了日</Label>
            <Input
              id='workCompleteDate'
              type='date'
              value={formData.directory_custom_items['作業完了日'].value}
              onChange={(e) => {
                const newCustomItems = { ...formData.directory_custom_items };
                newCustomItems['作業完了日'].value = e.target.value;
                setFormData(prev => ({ ...prev, directory_custom_items: newCustomItems }));
              }}
            />
          </div>

          <div className='col-span-3 space-y-2'>
            <Label htmlFor='receiptDate'>受注日</Label>
            <Input
              id='receiptDate'
              type='date'
              value={formData.directory_custom_items['受注日'].value}
              onChange={(e) => {
                const newCustomItems = { ...formData.directory_custom_items };
                newCustomItems['受注日'].value = e.target.value;
                setFormData(prev => ({ ...prev, directory_custom_items: newCustomItems }));
              }}
            />
          </div>

          {/* ステータス */}
          <div className='col-span-2 space-y-2'>
            <Label htmlFor='projectStatus'>案件状況</Label>
            <Select
              value={formData.directory_custom_items['案件ステータス'].value}
              onValueChange={(value) => {
                const newCustomItems = { ...formData.directory_custom_items };
                newCustomItems['案件ステータス'].value = value;
                newCustomItems['案件ステータス'].color = 
                  value === '問い合わせ' ? 'purple' :
                  value === '見積もり中' ? 'yellow' :
                  value === '受注確定' ? 'indigo' :
                  value === '製作中' ? 'blue' :
                  value === '納品完了' ? 'green' : 'gray';
                setFormData(prev => ({ ...prev, directory_custom_items: newCustomItems }));
              }}
            >
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='問い合わせ'>問い合わせ</SelectItem>
                <SelectItem value='見積もり中'>見積もり中</SelectItem>
                <SelectItem value='受注確定'>受注確定</SelectItem>
                <SelectItem value='製作中'>製作中</SelectItem>
                <SelectItem value='納品完了'>納品完了</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='col-span-2 space-y-2'>
            <Label htmlFor='quotationStatus'>見積書ステータス</Label>
            <Select
              value={formData.directory_custom_items['見積書ステータス'].value}
              onValueChange={(value) => {
                const newCustomItems = { ...formData.directory_custom_items };
                newCustomItems['見積書ステータス'].value = value;
                newCustomItems['見積書ステータス'].color = 
                  value === '未提出' ? 'red' :
                  value === '作成中' ? 'orange' :
                  value === '提出済' ? 'blue' : 'gray';
                setFormData(prev => ({ ...prev, directory_custom_items: newCustomItems }));
              }}
            >
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='未提出'>未提出</SelectItem>
                <SelectItem value='作成中'>作成中</SelectItem>
                <SelectItem value='提出済'>提出済</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='col-span-2 space-y-2'>
            <Label htmlFor='deliveryStatus'>納品書ステータス</Label>
            <Select
              value={formData.directory_custom_items['納品書ステータス'].value}
              onValueChange={(value) => {
                const newCustomItems = { ...formData.directory_custom_items };
                newCustomItems['納品書ステータス'].value = value;
                newCustomItems['納品書ステータス'].color = 
                  value === '未対応' ? 'gray' :
                  value === '配送準備中' ? 'yellow' :
                  value === '配送中' ? 'orange' :
                  value === '配送完了' ? 'green' : 'gray';
                setFormData(prev => ({ ...prev, directory_custom_items: newCustomItems }));
              }}
            >
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='未対応'>未対応</SelectItem>
                <SelectItem value='配送準備中'>配送準備中</SelectItem>
                <SelectItem value='配送中'>配送中</SelectItem>
                <SelectItem value='配送完了'>配送完了</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose}>
            キャンセル
          </Button>
          <Button onClick={handleSubmit}>案件を登録</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
