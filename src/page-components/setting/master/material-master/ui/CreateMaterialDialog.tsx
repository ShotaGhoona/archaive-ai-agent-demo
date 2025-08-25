"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
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
  Textarea,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared";
import { Plus } from "lucide-react";
import { MaterialMaster } from "../lib";

const formSchema = z.object({
  materialName: z.string().min(1, "材料名は必須です").max(50, "材料名は50文字以内で入力してください"),
  materialCategory: z.string().min(1, "カテゴリは必須です"),
  formula: z.string().min(1, "計算式は必須です"),
  supplier: z.string().min(1, "仕入れ先は必須です").max(50, "仕入れ先は50文字以内で入力してください"),
  remarks: z.string().max(200, "備考は200文字以内で入力してください").optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateMaterialDialogProps {
  onSubmit: (data: Omit<MaterialMaster, 'id' | 'updatedAt'>) => void;
}

// 計算方法の選択肢
const CALCULATION_METHODS = [
  { id: 'area', label: '面積ベース', formula: 'length * width', description: '長さ×幅' },
  { id: 'volume', label: '体積ベース', formula: 'length * width * height', description: '長さ×幅×高さ' },
  { id: 'weight', label: '重量ベース', formula: 'weight', description: '重量' },
  { id: 'length', label: '長さベース', formula: 'length', description: '長さのみ' },
] as const;

// 材料カテゴリ
const MATERIAL_CATEGORIES = [
  "鉄鋼",
  "アルミニウム", 
  "ステンレス",
  "樹脂",
  "その他"
] as const;

export function CreateMaterialDialog({ onSubmit }: CreateMaterialDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [unitPrice, setUnitPrice] = useState<number>(0);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materialName: "",
      materialCategory: "",
      formula: "",
      supplier: "",
      remarks: "",
    },
  });

  // 計算式を生成
  const generateFormula = (methodId: string, price: number) => {
    const method = CALCULATION_METHODS.find(m => m.id === methodId);
    if (!method || price <= 0) return "";
    return `${method.formula} * ${price}`;
  };

  // 計算方法または単価が変更されたときに計算式を更新
  const updateFormula = () => {
    if (selectedMethod && unitPrice > 0) {
      const formula = generateFormula(selectedMethod, unitPrice);
      form.setValue('formula', formula);
    }
  };

  // プレビュー計算
  const calculatePreview = () => {
    const formula = form.watch('formula');
    if (!formula) return null;
    
    try {
      // サンプル値で計算
      const exampleValues = {
        length: 100,
        width: 50,
        height: 20,
        weight: 2,
      };
      
      let evalFormula = formula;
      Object.entries(exampleValues).forEach(([key, value]) => {
        evalFormula = evalFormula.replace(new RegExp(key, 'g'), value.toString());
      });
      
      // 安全な計算実行
      const result = Function('"use strict"; return (' + evalFormula + ')')();
      return isNaN(result) ? null : Math.round(result);
    } catch {
      return null;
    }
  };

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onSubmit({
        materialName: data.materialName,
        materialCategory: data.materialCategory,
        formula: data.formula,
        supplier: data.supplier,
        remarks: data.remarks || "",
      });
      form.reset();
      setSelectedMethod("");
      setUnitPrice(0);
      setOpen(false);
    } catch (error) {
      console.error("Error creating material:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setSelectedMethod("");
    setUnitPrice(0);
    setOpen(false);
  };

  const previewResult = calculatePreview();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          新しく材料を追加
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-7xl max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* 上部: 基本情報 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold pb-2">基本情報</h3>
              <div className="grid grid-cols-12 gap-4">
                <FormField
                  control={form.control}
                  name="materialName"
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormLabel>
                        材料名 <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="例: SS400 板材" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="materialCategory"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>
                        カテゴリ <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="カテゴリを選択" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MATERIAL_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supplier"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>
                        仕入れ先 <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="例: 田中鋼材株式会社" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>備考</FormLabel>
                    <FormControl>
                      <Textarea placeholder="材料に関する追加情報を入力してください" rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 下部: 計算式設定 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold pb-2">価格計算式設定</h3>
              
              <div className="grid grid-cols-2 gap-6">
                {/* 左側: 計算式作成エリア */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">計算式を作成</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* 計算方法選択 */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">計算方法を選択</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {CALCULATION_METHODS.map((method) => (
                            <Button
                              key={method.id}
                              type="button"
                              variant="outline"
                              size="sm"
                              className={`h-auto p-3 text-left justify-start ${selectedMethod === method.id ? "bg-primary/20 text-primary" : ""}`}
                              onClick={() => {
                                setSelectedMethod(method.id);
                                updateFormula();
                              }}
                            >
                              <div className="text-xs w-full">
                                <div className="font-medium">{method.label}</div>
                                <div className="text-gray-500">{method.description}</div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* 単価入力 */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">単価（円）</h4>
                        <Input
                          type="number"
                          placeholder="単価を入力"
                          value={unitPrice || ""}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            setUnitPrice(value);
                            if (selectedMethod) {
                              setTimeout(updateFormula, 0);
                            }
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 右側: 作成された計算式とプレビュー */}
                <div className="space-y-4">
                  <Card>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="formula"
                        render={() => (
                          <FormItem>
                            <div className="space-y-4">
                              {/* 数式表示 */}
                              <h4 className="text-sm font-medium mb-2">作成された計算式</h4>
                              <div className="p-4 bg-gray-50 rounded border">
                                <div className="text-xs text-gray-500 mb-2">計算式</div>
                                <div className="font-mono text-lg min-h-[2rem] flex items-center">
                                  {form.watch('formula') ? (
                                    <span>{form.watch('formula')}</span>
                                  ) : (
                                    <span className="text-gray-400 text-sm">計算方法と単価を選択してください</span>
                                  )}
                                </div>
                              </div>

                              {/* プレビュー */}
                              {previewResult !== null && (
                                <div>
                                  <h4 className="text-sm font-medium mb-2">計算例 <span className="text-xs text-gray-500">※ 長さ100mm, 幅50mm, 高さ20mm, 重量2kg</span></h4>
                                  <div className="p-4 bg-gray-50 rounded border">
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-sm">計算式</span>
                                        <span className="font-mono text-sm">
                                          {form.watch('formula').replace(/length/g, '100mm').replace(/width/g, '50mm').replace(/height/g, '20mm').replace(/weight/g, '2kg')}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-end">
                                        <span className="text-sm">材料費目安</span>
                                        <span className="text-lg font-bold">
                                          {previewResult.toLocaleString()}円
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

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
                {isSubmitting ? "作成中..." : "作成"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}