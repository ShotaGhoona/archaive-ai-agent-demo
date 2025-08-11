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
import { Button } from "@/shared/shadcnui/button";
import { Textarea } from "@/shared/shadcnui/textarea";
import { Badge } from "@/shared/shadcnui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/shadcnui/card";
import { Plus, Calculator, Trash2, RotateCcw, Eye, Lightbulb } from "lucide-react";
import { ProcessMaster } from "../lib/processMasterColumns";

const formSchema = z.object({
  processName: z.string().min(1, "工程名は必須です").max(50, "工程名は50文字以内で入力してください"),
  processCategory: z.string().min(1, "カテゴリは必須です"),
  customFormula: z.string().min(1, "計算式は必須です"),
  hourlyCharge: z.number().min(0, "チャージは0以上で入力してください"),
  remarks: z.string().max(200, "備考は200文字以内で入力してください").optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateProcessDialogProps {
  onSubmit: (data: Omit<ProcessMaster, 'id' | 'updatedAt'>) => void;
}

// 計算式の要素
interface FormulaElement {
  id: string;
  type: 'variable' | 'operator' | 'number';
  value: string;
  label: string;
  unit?: string;
}

// 要素の型定義
type ElementType = 'variable' | 'number' | 'operator' | 'openParen' | 'closeParen';
type FormulaState = 'variable' | 'number' | 'operator' | 'openParen' | 'closeParen' | 'empty';

// 計算式の状態遷移ルール
const FORMULA_STATE_MACHINE: Record<FormulaState, { canAdd: ElementType[] }> = {
  // 変数・数値の後は演算子と閉じ括弧が可能
  'variable': { canAdd: ['operator', 'closeParen'] },
  'number': { canAdd: ['operator', 'closeParen'] },
  
  // 閉じ括弧の後は演算子と閉じ括弧が可能（ネストした括弧対応）
  'closeParen': { canAdd: ['operator', 'closeParen'] },
  
  // 演算子・開き括弧の後は変数・数値・開き括弧のみ  
  'operator': { canAdd: ['variable', 'number', 'openParen'] },
  'openParen': { canAdd: ['variable', 'number', 'openParen'] },
  
  // 初期状態では変数・数値・開き括弧のみ
  'empty': { canAdd: ['variable', 'number', 'openParen'] }
};

// 変数定義（シンプルに4つのみ）
const VARIABLES: FormulaElement[] = [
  { id: 'length', type: 'variable', value: 'length', label: '長さ', unit: 'mm' },
  { id: 'width', type: 'variable', value: 'width', label: '幅', unit: 'mm' },
  { id: 'height', type: 'variable', value: 'height', label: '高さ', unit: 'mm' },
  { id: 'weight', type: 'variable', value: 'weight', label: '重量', unit: 'kg' },
];

// 演算子（マーク表示）
const OPERATORS: FormulaElement[] = [
  { id: 'add', type: 'operator', value: ' + ', label: '+' },
  { id: 'subtract', type: 'operator', value: ' - ', label: '−' },
  { id: 'multiply', type: 'operator', value: ' * ', label: '×' },
  { id: 'divide', type: 'operator', value: ' / ', label: '÷' },
  { id: 'openParen', type: 'operator', value: '(', label: '(' },
  { id: 'closeParen', type: 'operator', value: ')', label: ')' },
];

// 演算子タイプのマッピング
const getOperatorType = (operatorId: string): ElementType => {
  if (operatorId === 'openParen') return 'openParen';
  if (operatorId === 'closeParen') return 'closeParen';
  return 'operator';
};

// 計算式テンプレート（縦並び用）
const FORMULA_TEMPLATES = [
  { 
    name: '面積ベース', 
    formula: 'length * width * 100',
    description: '長さ×幅×100円',
    icon: '📐'
  },
  { 
    name: '体積ベース', 
    formula: 'length * width * height * 50',
    description: '長さ×幅×高さ×50円',
    icon: '📦'
  },
  { 
    name: '長さベース', 
    formula: 'length * 80',
    description: '長さ×80円',
    icon: '📏'
  },
  { 
    name: '重量ベース', 
    formula: 'weight * 500',
    description: '重量×500円',
    icon: '⚖️'
  },
  { 
    name: '固定額', 
    formula: '5000',
    description: '固定5000円',
    icon: '💰'
  },
];

export function CreateProcessDialog({ onSubmit }: CreateProcessDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formulaElements, setFormulaElements] = useState<FormulaElement[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);

  // 現在の計算式の状態を取得
  const getCurrentState = (): FormulaState => {
    if (formulaElements.length === 0) return 'empty';
    
    const lastElement = formulaElements[formulaElements.length - 1];
    
    if (lastElement.type === 'variable' || lastElement.type === 'number') {
      return lastElement.type;
    }
    
    if (lastElement.type === 'operator') {
      return getOperatorType(lastElement.id);
    }
    
    return 'empty';
  };

  // 要素が追加可能かチェック
  const canAddElement = (elementType: ElementType): boolean => {
    const currentState = getCurrentState();
    const allowedTypes = FORMULA_STATE_MACHINE[currentState].canAdd;
    
    return allowedTypes.includes(elementType);
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      processName: "",
      processCategory: "",
      customFormula: "",
      hourlyCharge: 2000,
      remarks: "",
    },
  });

  // 要素を追加
  const addElement = (element: FormulaElement) => {
    let elementType: ElementType;
    
    if (element.type === 'variable') {
      elementType = 'variable';
    } else if (element.type === 'number') {
      elementType = 'number';
    } else if (element.type === 'operator') {
      elementType = getOperatorType(element.id);
    } else {
      return; // 無効なタイプ
    }
    
    // 状態チェック：追加不可能な場合は何もしない
    if (!canAddElement(elementType)) {
      return;
    }
    
    const newElement = { ...element, id: `${element.id}_${Date.now()}` };
    setFormulaElements(prev => [...prev, newElement]);
    updateFormula([...formulaElements, newElement]);
  };

  // 要素を削除
  const removeElement = (index: number) => {
    const newElements = formulaElements.filter((_, i) => i !== index);
    setFormulaElements(newElements);
    updateFormula(newElements);
  };

  // 計算式を更新
  const updateFormula = (elements: FormulaElement[]) => {
    const formula = elements.map(el => el.value).join('');
    form.setValue('customFormula', formula);
  };

  // テンプレートを適用
  const applyTemplate = (template: typeof FORMULA_TEMPLATES[0]) => {
    form.setValue('customFormula', template.formula);
    // 要素リストをクリア
    setFormulaElements([]);
  };

  // リセット
  const resetFormula = () => {
    setFormulaElements([]);
    form.setValue('customFormula', '');
  };

  // プレビュー計算
  const calculatePreview = () => {
    const formula = form.watch('customFormula');
    if (!formula) return null;
    
    try {
      // サンプル値で計算
      const exampleValues = {
        length: 100,
        width: 50,
        height: 20,
        area: 50,
        volume: 100,
        weight: 2,
        partCount: 5,
        manHour: 1
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
        processName: data.processName,
        processCategory: data.processCategory,
        customFormula: data.customFormula,
        remarks: data.remarks || "",
      });
      form.reset();
      setFormulaElements([]);
      setOpen(false);
    } catch (error) {
      console.error("Error creating process:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setFormulaElements([]);
    setOpen(false);
  };

  const previewResult = calculatePreview();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          工程追加
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
                  name="processName"
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormLabel>
                        工程名 <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="例: プレス加工" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="processCategory"
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
                          <SelectItem value="加工">加工</SelectItem>
                          <SelectItem value="組立">組立</SelectItem>
                          <SelectItem value="検査">検査</SelectItem>
                          <SelectItem value="塗装">塗装</SelectItem>
                          <SelectItem value="溶接">溶接</SelectItem>
                          <SelectItem value="その他">その他</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hourlyCharge"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>
                        チャージ <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="2000"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
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
                      <Textarea placeholder="工程に関する追加情報を入力してください" rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 下部: 計算式専用エリア */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold pb-2 flex-1">見積もり用計算式設定</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="flex items-center gap-2"
                >
                  <Lightbulb className="h-4 w-4" />
                  テンプレート
                  {showTemplates ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <RotateCcw className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* よく使うテンプレート（トグル表示） */}
              {showTemplates && (
                <div className="mb-6">
                  <div className="p-4 bg-gray-50 rounded border">
                    <h4 className="text-sm font-medium mb-3">よく使うテンプレート</h4>
                    <div className="grid grid-cols-5 gap-3">
                      {FORMULA_TEMPLATES.map((template) => (
                        <Card
                          key={template.name}
                          className="cursor-pointer border"
                          onClick={() => {
                            applyTemplate(template);
                            setShowTemplates(false);
                          }}
                        >
                          <CardContent className="p-3 text-center">
                            <div className="text-lg mb-1">{template.icon}</div>
                            <div className="text-sm font-medium mb-1">{template.name}</div>
                            <div className="text-xs text-gray-600">{template.description}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                {/* 左側: 計算式作成エリア */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">計算式を作成</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* 変数選択 */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">変数・数値を選択</h4>
                        <div className="grid grid-cols-5 gap-2">
                          {VARIABLES.map((variable) => {
                            const isDisabled = !canAddElement('variable');
                            return (
                              <Button
                                key={variable.id}
                                type="button"
                                variant="outline"
                                size="sm"
                                className={`h-auto p-3 text-left justify-start ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => addElement(variable)}
                                disabled={isDisabled}
                              >
                                <div className="text-xs w-full">
                                  <div className="font-medium">{variable.label}</div>
                                  <div className="text-gray-500">({variable.unit})</div>
                                </div>
                              </Button>
                            );
                          })}
                          
                          {/* カスタム数値入力ボタン */}
                          <div className="relative">
                            {(() => {
                              const isDisabled = !canAddElement('number');
                              return (
                                <Input
                                  type="number"
                                  placeholder="数値"
                                  className={`h-auto p-3 text-center text-xs border-2 border-dashed ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
                                  disabled={isDisabled}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !isDisabled) {
                                      e.preventDefault();
                                      const input = e.target as HTMLInputElement;
                                      if (input.value) {
                                        addElement({
                                          id: `number_${Date.now()}`,
                                          type: 'number',
                                          value: input.value,
                                          label: input.value
                                        });
                                        input.value = '';
                                      }
                                    }
                                  }}
                                  onBlur={(e) => {
                                    if (!isDisabled) {
                                      const input = e.target as HTMLInputElement;
                                      if (input.value) {
                                        addElement({
                                          id: `number_${Date.now()}`,
                                          type: 'number',
                                          value: input.value,
                                          label: input.value
                                        });
                                        input.value = '';
                                      }
                                    }
                                  }}
                                />
                              );
                            })()}
                            <div className="absolute -bottom-5 left-0 right-0 text-xs text-gray-400 text-center">
                              数値入力
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 演算子選択 */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">演算子を選択</h4>
                        <div className="grid grid-cols-6 gap-2">
                          {OPERATORS.map((operator) => {
                            const operatorType = getOperatorType(operator.id);
                            const isDisabled = !canAddElement(operatorType);
                            return (
                              <Button
                                key={operator.id}
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addElement(operator)}
                                className={`h-12 text-lg ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isDisabled}
                              >
                                {operator.label}
                              </Button>
                            );
                          })}
                        </div>
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
                        name="customFormula"
                        render={() => (
                          <FormItem>
                            <div className="space-y-4">
                              {/* 数式表示 */}
                              <h4 className="text-sm font-medium mb-2">作成された計算式</h4>
                              <div className="p-4 bg-gray-50 rounded border group">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="text-xs text-gray-500">計算式</div>
                                  {form.watch('customFormula') && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={resetFormula}
                                      className="text-red-600 h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                                
                                <div className="font-mono text-lg min-h-[2rem] flex items-center">
                                  {form.watch('customFormula') ? (
                                    <span>({form.watch('customFormula')}) × charge</span>
                                  ) : (
                                    <span className="text-gray-400 text-sm">式を作成してください</span>
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
                                          {form.watch('customFormula').replace(/length/g, '100mm').replace(/width/g, '50mm').replace(/height/g, '20mm').replace(/weight/g, '2kg')} × {form.watch('hourlyCharge')}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-end">
                                        <span className="text-sm">加工費合計目安</span>
                                        <span className="text-lg font-bold">
                                          {(previewResult * form.watch('hourlyCharge')).toLocaleString()}円
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