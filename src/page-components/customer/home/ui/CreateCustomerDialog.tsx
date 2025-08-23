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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Button,
} from "@/shared";
import { Plus } from "lucide-react";
import { Customer } from "../lib";

const formSchema = z.object({
  customerName: z.string().min(1, "取引先名は必須です").max(100, "取引先名は100文字以内で入力してください"),
  contactPerson: z.string().min(1, "取引先担当者は必須です").max(50, "担当者名は50文字以内で入力してください"),
  salesRepresentative: z.string().min(1, "営業担当者は必須です"),
  phoneNumber: z.string()
    .min(1, "電話番号は必須です")
    .regex(/^[\d-]+$/, "電話番号は数字とハイフンのみ使用できます")
    .min(10, "電話番号は10文字以上で入力してください"),
  faxNumber: z.string()
    .optional()
    .refine(val => !val || /^[\d-]+$/.test(val), "FAX番号は数字とハイフンのみ使用できます"),
  rank: z.enum(['S', 'A', 'B', 'C']),
  industry: z.string().min(1, "業界は必須です"),
});

type FormData = z.infer<typeof formSchema>;

interface CreateCustomerDialogProps {
  onSubmit: (data: Omit<Customer, 'customerCode'>) => void;
}

export function CreateCustomerDialog({ onSubmit }: CreateCustomerDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      contactPerson: "",
      salesRepresentative: "",
      phoneNumber: "",
      faxNumber: "",
      rank: "B",
      industry: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      // faxNumberがundefinedの場合は空文字列に変換
      const customerData = {
        ...data,
        faxNumber: data.faxNumber || ""
      };
      onSubmit(customerData);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error creating customer:", error);
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
          新規取引先登録
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>新規取引先登録</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* 取引先名 */}
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      取引先名 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="例: 株式会社田中製作所" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 取引先担当者 */}
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      取引先担当者 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="例: 田中太郎" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 営業担当者 */}
              <FormField
                control={form.control}
                name="salesRepresentative"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      営業担当者 <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="営業担当者を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="山田花子">山田花子</SelectItem>
                        <SelectItem value="田中一郎">田中一郎</SelectItem>
                        <SelectItem value="佐藤美咲">佐藤美咲</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ランク */}
              <FormField
                control={form.control}
                name="rank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      ランク <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="ランクを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="S">S</SelectItem>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
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

              {/* FAX番号 */}
              <FormField
                control={form.control}
                name="faxNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FAX番号</FormLabel>
                    <FormControl>
                      <Input placeholder="例: 03-1234-5679" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 業界 */}
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    業界 <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="業界を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="自動車部品">自動車部品</SelectItem>
                      <SelectItem value="産業機械">産業機械</SelectItem>
                      <SelectItem value="電子部品">電子部品</SelectItem>
                      <SelectItem value="食品加工">食品加工</SelectItem>
                      <SelectItem value="医療機器">医療機器</SelectItem>
                      <SelectItem value="航空宇宙">航空宇宙</SelectItem>
                      <SelectItem value="その他">その他</SelectItem>
                    </SelectContent>
                  </Select>
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