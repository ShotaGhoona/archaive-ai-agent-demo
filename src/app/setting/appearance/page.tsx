"use client";

import { Button } from "@/shared/shadcnui";
import { Label } from "@/shared/shadcnui";
import { RadioGroup, RadioGroupItem } from "@/shared/shadcnui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/shadcnui";
import { Moon, Sun, Monitor } from "lucide-react";

export default function AppearanceSettingPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">外観</h1>
        <p className="text-muted-foreground">
          アプリケーションの見た目をカスタマイズします
        </p>
      </div>

      <div className="space-y-8">
        {/* テーマ設定 */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">テーマ</h2>
            <p className="text-sm text-muted-foreground">
              アプリケーションのテーマを選択してください
            </p>
          </div>
          <RadioGroup defaultValue="system" className="grid grid-cols-3 gap-4">
            <div>
              <RadioGroupItem value="light" id="light" className="peer sr-only" />
              <Label
                htmlFor="light"
                className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <Sun className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">ライト</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
              <Label
                htmlFor="dark"
                className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <Moon className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">ダーク</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="system" id="system" className="peer sr-only" />
              <Label
                htmlFor="system"
                className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <Monitor className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">システム</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* アクセントカラー */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">アクセントカラー</h2>
            <p className="text-sm text-muted-foreground">
              ボタンやリンクの色を選択してください
            </p>
          </div>
          <div className="flex gap-2">
            {[
              { name: "Blue", color: "bg-blue-500" },
              { name: "Green", color: "bg-green-500" },
              { name: "Purple", color: "bg-purple-500" },
              { name: "Red", color: "bg-red-500" },
              { name: "Orange", color: "bg-orange-500" },
              { name: "Pink", color: "bg-pink-500" },
            ].map((option) => (
              <button
                key={option.name}
                className={`w-10 h-10 rounded-lg ${option.color} hover:ring-2 hover:ring-offset-2 hover:ring-gray-400 transition-all`}
                aria-label={option.name}
              />
            ))}
          </div>
        </div>

        {/* フォント設定 */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">フォント</h2>
            <p className="text-sm text-muted-foreground">
              表示フォントを選択してください
            </p>
          </div>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="font-family">フォントファミリー</Label>
              <Select defaultValue="system">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">システムフォント</SelectItem>
                  <SelectItem value="noto">Noto Sans JP</SelectItem>
                  <SelectItem value="inter">Inter</SelectItem>
                  <SelectItem value="roboto">Roboto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="font-size">フォントサイズ</Label>
              <Select defaultValue="medium">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">小</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="large">大</SelectItem>
                  <SelectItem value="xlarge">特大</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 保存ボタン */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline">キャンセル</Button>
          <Button>変更を保存</Button>
        </div>
      </div>
    </div>
  );
}