"use client";

import { Button } from "@/shared/shadcnui";
import { Label } from "@/shared/shadcnui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/shadcnui";
import { Switch } from "@/shared/shadcnui";

export default function GeneralSettingPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">一般設定</h1>
        <p className="text-muted-foreground">
          アプリケーションの基本的な設定を管理します
        </p>
      </div>

      <div className="space-y-8">
        {/* 言語設定 */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">言語</h2>
            <p className="text-sm text-muted-foreground">
              表示言語を選択してください
            </p>
          </div>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="language">表示言語</Label>
              <Select defaultValue="ja">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="ko">한국어</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* タイムゾーン設定 */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">タイムゾーン</h2>
            <p className="text-sm text-muted-foreground">
              お住まいの地域のタイムゾーンを選択してください
            </p>
          </div>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="timezone">タイムゾーン</Label>
              <Select defaultValue="asia-tokyo">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asia-tokyo">Asia/Tokyo (JST)</SelectItem>
                  <SelectItem value="america-ny">America/New York (EST)</SelectItem>
                  <SelectItem value="europe-london">Europe/London (GMT)</SelectItem>
                  <SelectItem value="asia-shanghai">Asia/Shanghai (CST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 表示設定 */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">表示設定</h2>
            <p className="text-sm text-muted-foreground">
              画面表示に関する設定
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compact">コンパクト表示</Label>
                <p className="text-sm text-muted-foreground">
                  情報を密度高く表示します
                </p>
              </div>
              <Switch id="compact" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="animations">アニメーション</Label>
                <p className="text-sm text-muted-foreground">
                  画面遷移時のアニメーションを有効にします
                </p>
              </div>
              <Switch id="animations" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="tooltips">ツールチップ</Label>
                <p className="text-sm text-muted-foreground">
                  ホバー時のヘルプテキストを表示します
                </p>
              </div>
              <Switch id="tooltips" defaultChecked />
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