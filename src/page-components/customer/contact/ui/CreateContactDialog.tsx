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
  Textarea,
} from '@/shared';
import { Plus } from 'lucide-react';

// 後々entityに移動すると思う　山下0830
const formSchema = z.object({
  last_name: z.string().min(1, '姓は必須です'),
  first_name: z.string().min(1, '名は必須です'),
  last_name_kana: z.string().optional(),
  first_name_kana: z.string().optional(),
  customer_contact_custom_items: z.object({
    部署: z.object({
      value: z.string(),
      color: z.string(),
      type: z.literal('SELECT'),
    }).optional(),
    役職: z.object({
      value: z.string(),
      color: z.string(),
      type: z.literal('SELECT'),
    }).optional(),
    営業メモ: z.object({
      value: z.string(),
      type: z.literal('TEXT'),
    }).optional(),
  }).optional(),
  email_primary: z.string().optional(),
  email_secondary: z.string().optional(),
  office_phone_number: z.string().optional(),
  phone_number: z.string().optional(),
  fax: z.string().optional(),
  remarks: z.string().optional(),
  is_active: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateContactDialogProps {
  customerId: number;
  onSubmit: (data: FormData) => void;
}

export function CreateContactDialog({ onSubmit }: CreateContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      is_active: true,
      customer_contact_custom_items: {
        部署: { value: '', color: 'blue', type: 'SELECT' },
        役職: { value: '', color: 'purple', type: 'SELECT' },
        営業メモ: { value: '', type: 'TEXT' },
      },
    },
  });

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSubmit(data);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error creating contact:', error);
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
          新規担当者登録
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[90vh] min-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>新規担当者登録</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='last_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      姓 <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='例: 田中' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='first_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      名 <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='例: 祐希' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='last_name_kana'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>姓（カナ）</FormLabel>
                    <FormControl>
                      <Input placeholder='例: タナカ' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='first_name_kana'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>名（カナ）</FormLabel>
                    <FormControl>
                      <Input placeholder='例: ユウキ' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='customer_contact_custom_items.役職.value'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>役職</FormLabel>
                    <FormControl>
                      <Input placeholder='例: 部長' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='customer_contact_custom_items.部署.value'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>部署名</FormLabel>
                    <FormControl>
                      <Input placeholder='例: 営業部' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='email_primary'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>主要メールアドレス</FormLabel>
                  <FormControl>
                    <Input placeholder='例: tanaka@example.co.jp' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email_secondary'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>副メールアドレス</FormLabel>
                  <FormControl>
                    <Input placeholder='例: tanaka@personal.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='office_phone_number'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>会社電話番号</FormLabel>
                    <FormControl>
                      <Input placeholder='例: 03-1234-5678' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone_number'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>携帯電話番号</FormLabel>
                    <FormControl>
                      <Input placeholder='例: 080-1234-5678' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='fax'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FAX番号</FormLabel>
                  <FormControl>
                    <Input placeholder='例: 03-1234-5679' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='customer_contact_custom_items.営業メモ.value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>営業メモ</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='例: 技術的な相談が可能'
                      className='resize-none'
                      rows={3}
                      {...field}
                    />
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
                      placeholder='例: 主要な窓口担当者'
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
