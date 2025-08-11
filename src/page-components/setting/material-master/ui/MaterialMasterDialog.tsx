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

const formSchema = z.object({
  category: z.string().min(1, "材料カテゴリは必須です"),
  materialName: z.string().min(1, "材料名は必須です"),
  specification: z.string().min(1, "規格・仕様は必須です"),
  unit: z.string().min(1, "単位は必須です"),
  unitPrice: z.number().min(0, "単価は0以上である必要があります"),
  supplier: z.string().min(1, "仕入先は必須です"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface MaterialMasterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
}

const materialCategories = [
  "鋼材",
  "アルミ材",
  "ステンレス",
  "銅材",
  "樹脂材",
  "ゴム材",
  "セラミック材",
  "複合材",
  "その他"
];

const commonUnits = [
  "kg",
  "g",
  "m",
  "mm",
  "cm",
  "枚",
  "本",
  "個",
  "セット",
  "m²",
  "m³",
  "L",
  "その他"
];

export function MaterialMasterDialog({
  open,
  onOpenChange,
  onSubmit,
}: MaterialMasterDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      materialName: "",
      specification: "",
      unit: "",
      unitPrice: 0,
      supplier: "",
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
          <DialogTitle>材料費マスター 新規登録</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* 材料カテゴリ */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      材料カテゴリ <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="カテゴリを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {materialCategories.map((category) => (
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

              {/* 材料名 */}
              <FormField
                control={form.control}
                name="materialName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      材料名 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="例: SS400, A5052" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 規格・仕様 */}
              <FormField
                control={form.control}
                name="specification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      規格・仕様 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="例: 板厚6mm, 丸棒φ30mm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 単位 */}
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      単位 <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="単位を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {commonUnits.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 単価 */}
              <FormField
                control={form.control}
                name="unitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      単価（円） <span className="text-red-500">*</span>
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

              {/* 仕入先 */}
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      仕入先 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="例: 山田鋼材, 田中商事" {...field} />
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
                      placeholder="材料の特徴や注意点などを入力..."
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