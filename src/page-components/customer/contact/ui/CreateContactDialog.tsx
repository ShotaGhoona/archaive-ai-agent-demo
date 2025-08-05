"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/shared/shadcnui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/shadcnui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/shadcnui/select";
import { Input } from "@/shared/shadcnui/input";
import { Textarea } from "@/shared/shadcnui/textarea";
import { Button } from "@/shared/shadcnui/button";
import { Plus } from "lucide-react";
import { Contact } from "../lib/contactColumns";

const formSchema = z.object({
  contactName: z.string().min(1, "連絡先名は必須です").max(50, "連絡先名は50文字以内で入力してください"),
  department: z.string().min(1, "部門は必須です"),
  position: z.string().min(1, "役職は必須です"),
  contactType: z.enum(['primary', 'secondary', 'emergency']),
  phoneNumber: z.string()
    .min(1, "電話番号は必須です")
    .regex(/^[\d-]+$/, "電話番号は数字とハイフンのみ使用できます")
    .min(10, "電話番号は10文字以上で入力してください"),
  mobileNumber: z.string()
    .optional()
    .refine(val => !val || /^[\d-]+$/.test(val), "携帯電話番号は数字とハイフンのみ使用できます"),
  email: z.string()
    .min(1, "メールアドレスは必須です")
    .email("有効なメールアドレスを入力してください"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateContactDialogProps {
  customerId: string;
  onSubmit: (data: Omit<Contact, 'contactId' | 'customerId' | 'createdAt' | 'updatedAt' | 'isActive'>) => void;
}

export function CreateContactDialog({ /* customerId, */ onSubmit }: CreateContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactName: "",
      department: "",
      position: "",
      contactType: "secondary",
      phoneNumber: "",
      mobileNumber: "",
      email: "",
      notes: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onSubmit(data);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error creating contact:", error);
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
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          新規連絡先登録
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新規連絡先登録</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* 連絡先名 */}
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      連絡先名 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="例: 田中太郎" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 部門 */}
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      部門 <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="部門を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="営業部">営業部</SelectItem>
                        <SelectItem value="技術部">技術部</SelectItem>
                        <SelectItem value="製造部">製造部</SelectItem>
                        <SelectItem value="品質管理部">品質管理部</SelectItem>
                        <SelectItem value="経理部">経理部</SelectItem>
                        <SelectItem value="総務部">総務部</SelectItem>
                        <SelectItem value="企画部">企画部</SelectItem>
                        <SelectItem value="その他">その他</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 役職 */}
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      役職 <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="役職を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="取締役">取締役</SelectItem>
                        <SelectItem value="部長">部長</SelectItem>
                        <SelectItem value="課長">課長</SelectItem>
                        <SelectItem value="係長">係長</SelectItem>
                        <SelectItem value="主任">主任</SelectItem>
                        <SelectItem value="担当者">担当者</SelectItem>
                        <SelectItem value="その他">その他</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 連絡先タイプ */}
              <FormField
                control={form.control}
                name="contactType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      連絡先タイプ <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="タイプを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="primary">主要連絡先</SelectItem>
                        <SelectItem value="secondary">副次連絡先</SelectItem>
                        <SelectItem value="emergency">緊急連絡先</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 電話番号 */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      電話番号 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="例: 03-1234-5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 携帯電話番号 */}
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>携帯電話番号</FormLabel>
                    <FormControl>
                      <Input placeholder="例: 090-1234-5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* メールアドレス */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    メールアドレス <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="例: tanaka@example.co.jp" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 備考 */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>備考</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="その他の情報があれば記入してください"
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                キャンセル
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "登録中..." : "登録"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}