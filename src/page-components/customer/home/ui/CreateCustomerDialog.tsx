'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/shared';
import { Plus } from 'lucide-react';

const formSchema = z.object({
  seq_num: z.number().min(1, '顧客番号は必須です'),
  name: z.string().min(1, '顧客名は必須です'),
  name_kana: z.string().optional(),
  customer_status: z.string().min(1, 'ステータスは必須です'),
  annual_revenue: z.number().optional(),
  head_count: z.number().optional(),
  website: z.string().optional(),
  remarks: z.string().optional(),
  in_charge_name: z.string().min(1, '営業担当者は必須です'),
});

type FormData = z.infer<typeof formSchema>;

interface CreateCustomerDialogProps {
  onSubmit: (data: FormData) => void;
}

export function CreateCustomerDialog({ onSubmit }: CreateCustomerDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSubmit(data);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error creating customer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='lg' className='flex items-center gap-2'>
          <Plus className='h-4 w-4' />
          新規顧客登録
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[90vh] min-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>新規顧客登録</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='seq_num'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      顧客番号 <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type='number' 
                        placeholder='例: 1' 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='customer_status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      ステータス <span className='text-red-500'>*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='ステータスを選択' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='既存顧客'>既存顧客</SelectItem>
                        <SelectItem value='見込み客'>見込み客</SelectItem>
                        <SelectItem value='VIP顧客'>VIP顧客</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    顧客名 <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='例: 株式会社田中製作所' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='name_kana'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>顧客名（カナ）</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='例: カブシキガイシャタナカセイサクショ'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='annual_revenue'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>年間売上高</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='例: 500000000'
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='head_count'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>従業員数</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='例: 50'
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='in_charge_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    営業担当者 <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='例: 山田太郎' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='website'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webサイト</FormLabel>
                  <FormControl>
                    <Input placeholder='例: https://example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='remarks'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>備考</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='例: 精密部品製造を主力事業とする老舗企業'
                      className='resize-none'
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                キャンセル
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? '登録中...' : '登録'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
