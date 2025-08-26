"use client";

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
import { Project } from '../lib';

interface CreateProjectDialogProps {
  onSubmit?: (project: Omit<Project, 'projectId' | 'lastUpdatedBy' | 'lastUpdatedAt'>) => void;
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
}

export function CreateProjectDialog({ 
  onSubmit, 
  buttonText = "新規案件登録",
  buttonVariant = "default" 
}: CreateProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    assignee: '',
    responseDeadline: '',
    workCompleteDate: '',
    deliveryDeadline: '',
    receiptDate: '',
    projectStatus: '問い合わせ',
    quotationStatus: '未提出',
    deliveryStatus: '未対応',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = '顧客名は必須です';
    }
    if (!formData.assignee.trim()) {
      newErrors.assignee = '担当者は必須です';
    }
    if (!formData.responseDeadline) {
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
      customerName: '',
      assignee: '',
      responseDeadline: '',
      workCompleteDate: '',
      deliveryDeadline: '',
      receiptDate: '',
      projectStatus: '問い合わせ',
      quotationStatus: '未提出',
      deliveryStatus: '未対応',
    });
    setErrors({});
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant}
          className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 h-10"
        >
          <Plus className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            新規案件登録
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-6 gap-4 py-4">
          {/* 基本情報 */}
          <div className="space-y-2 col-span-3">
            <Label htmlFor="customerName">
              顧客名 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              placeholder="株式会社〇〇"
              className={errors.customerName ? 'border-red-500' : ''}
            />
            {errors.customerName && (
              <p className="text-xs text-red-500">{errors.customerName}</p>
            )}
          </div>

          <div className="space-y-2 col-span-3">
            <Label htmlFor="assignee">
              担当者 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="assignee"
              value={formData.assignee}
              onChange={(e) => handleInputChange('assignee', e.target.value)}
              placeholder="田中太郎"
              className={errors.assignee ? 'border-red-500' : ''}
            />
            {errors.assignee && (
              <p className="text-xs text-red-500">{errors.assignee}</p>
            )}
          </div>

          {/* 日程 */}
          <div className="space-y-2 col-span-3">
            <Label htmlFor="responseDeadline">
              回答期日 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="responseDeadline"
              type="date"
              value={formData.responseDeadline}
              onChange={(e) => handleInputChange('responseDeadline', e.target.value)}
              className={errors.responseDeadline ? 'border-red-500' : ''}
            />
            {errors.responseDeadline && (
              <p className="text-xs text-red-500">{errors.responseDeadline}</p>
            )}
          </div>

          <div className="space-y-2 col-span-3">
            <Label htmlFor="deliveryDeadline">納品期日</Label>
            <Input
              id="deliveryDeadline"
              type="date"
              value={formData.deliveryDeadline}
              onChange={(e) => handleInputChange('deliveryDeadline', e.target.value)}
            />
          </div>

          <div className="space-y-2 col-span-3">
            <Label htmlFor="workCompleteDate">作業完了日</Label>
            <Input
              id="workCompleteDate"
              type="date"
              value={formData.workCompleteDate}
              onChange={(e) => handleInputChange('workCompleteDate', e.target.value)}
            />
          </div>

          <div className="space-y-2 col-span-3">
            <Label htmlFor="receiptDate">入荷期日</Label>
            <Input
              id="receiptDate"
              type="date"
              value={formData.receiptDate}
              onChange={(e) => handleInputChange('receiptDate', e.target.value)}
            />
          </div>

          {/* ステータス */}
          <div className="space-y-2 col-span-2">
            <Label htmlFor="projectStatus">案件状況</Label>
            <Select value={formData.projectStatus} onValueChange={(value) => handleInputChange('projectStatus', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="問い合わせ">問い合わせ</SelectItem>
                <SelectItem value="見積もり中">見積もり中</SelectItem>
                <SelectItem value="納品">納品</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="quotationStatus">見積書ステータス</Label>
            <Select value={formData.quotationStatus} onValueChange={(value) => handleInputChange('quotationStatus', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="未提出">未提出</SelectItem>
                <SelectItem value="作成中">作成中</SelectItem>
                <SelectItem value="提出済">提出済</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="deliveryStatus">納品書ステータス</Label>
            <Select value={formData.deliveryStatus} onValueChange={(value) => handleInputChange('deliveryStatus', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="未対応">未対応</SelectItem>
                <SelectItem value="配送準備中">配送準備中</SelectItem>
                <SelectItem value="配送中">配送中</SelectItem>
                <SelectItem value="配送完了">配送完了</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            キャンセル
          </Button>
          <Button onClick={handleSubmit}>
            案件を登録
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}