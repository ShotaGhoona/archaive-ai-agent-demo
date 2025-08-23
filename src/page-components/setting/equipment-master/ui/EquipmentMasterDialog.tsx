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
  DialogFooter,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Textarea,
  Button,
} from "@/shared";

const formSchema = z.object({
  category: z.string().min(1, "設備カテゴリは必須です"),
  equipmentName: z.string().min(1, "設備名は必須です"),
  specification: z.string().min(1, "仕様・規格は必須です"),
  manufacturer: z.string().min(1, "メーカーは必須です"),
  hourlyRate: z.number().min(0, "時間単価は0以上である必要があります"),
  energyCost: z.number().min(0, "電力費は0以上である必要があります"),
  maintenanceCost: z.number().min(0, "保守費は0以上である必要があります"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EquipmentMasterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
}

const equipmentCategories = [
  "加工機械",
  "溶接機械",
  "測定機器",
  "搬送機械",
  "熱処理",
  "表面処理",
  "組立設備",
  "検査設備",
  "その他"
];

export function EquipmentMasterDialog({
  open,
  onOpenChange,
  onSubmit,
}: EquipmentMasterDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      equipmentName: "",
      specification: "",
      manufacturer: "",
      hourlyRate: 0,
      energyCost: 0,
      maintenanceCost: 0,
      notes: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onSubmit(data);
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>機械設備マスター 新規登録</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* 設備カテゴリ */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      設備カテゴリ <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="カテゴリを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {equipmentCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 設備名 */}
              <FormField
                control={form.control}
                name="equipmentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      設備名 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="例: NC旋盤, マシニングセンタ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 仕様・規格 */}
              <FormField
                control={form.control}
                name="specification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      仕様・規格 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="例: 最大加工径φ200mm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* メーカー */}
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      メーカー <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="例: ヤマザキマザック, オークマ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* 時間単価 */}
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      時間単価（円/h） <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 電力費 */}
              <FormField
                control={form.control}
                name="energyCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      電力費（円/h） <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 保守費 */}
              <FormField
                control={form.control}
                name="maintenanceCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      保守費（円/h） <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 備考 */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>備考</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="設備の特徴や運用上の注意点などを入力..."
                      className="resize-none"
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