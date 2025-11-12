'use client';

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/shared/shadcnui/ui/card';
import { Button } from '@/shared/shadcnui/ui/button';
import { Input } from '@/shared/shadcnui/ui/input';
import { Textarea } from '@/shared/shadcnui/ui/textarea';
import { Separator } from '@/shared/shadcnui/ui/separator';
import { Badge } from '@/shared/shadcnui/ui/badge';

// 新規追加コンポーネント
import { ButtonGroup } from '@/shared/shadcnui/ui/button-group';
import { Empty } from '@/shared/shadcnui/ui/empty';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/shadcnui/ui/field';
import { InputGroup, InputGroupAddon, InputGroupButton } from '@/shared/shadcnui/ui/input-group';
import { Item, ItemGroup, ItemMedia, ItemContent, ItemTitle, ItemDescription } from '@/shared/shadcnui/ui/item';
import { Kbd } from '@/shared/shadcnui/ui/kbd';
import { Spinner } from '@/shared/shadcnui/ui/spinner';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/shadcnui/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Search,
  Mail,
  User,
  Star,
  Heart,
  Settings,
  Inbox,
  FileText,
  Calendar,
  TrendingUp,
} from 'lucide-react';

// セクションラッパー
const Section = ({
  title,
  description,
  isNew = false,
  children
}: {
  title: string;
  description: string;
  isNew?: boolean;
  children: React.ReactNode;
}) => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <CardTitle>{title}</CardTitle>
        {isNew && <Badge variant="default">2025年新規追加</Badge>}
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {children}
    </CardContent>
  </Card>
);

// コード表示コンポーネント
const CodeBlock = ({ children }: { children: string }) => (
  <div className="rounded-md bg-slate-950 p-4 font-mono text-sm text-slate-50">
    <pre className="overflow-x-auto">{children}</pre>
  </div>
);

export default function ShadcnUIShowcase() {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [fieldError, setFieldError] = useState('');

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const handleFieldValidation = (value: string) => {
    setEmailValue(value);
    if (value && !value.includes('@')) {
      setFieldError('有効なメールアドレスを入力してください');
    } else {
      setFieldError('');
    }
  };

  // Chart用のデータ
  const chartData = [
    { month: '1月', desktop: 186 },
    { month: '2月', desktop: 305 },
    { month: '3月', desktop: 237 },
    { month: '4月', desktop: 73 },
    { month: '5月', desktop: 209 },
    { month: '6月', desktop: 214 },
  ];

  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  return (
    <div className="container mx-auto space-y-8 p-6">
      {/* ヘッダー */}
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          shadcn/ui コンポーネントショーケース
        </h1>
        <p className="text-muted-foreground text-lg">
          新しく追加された shadcn/ui コンポーネントのデモンストレーション
        </p>
        <Badge variant="outline" className="text-sm">
          54 コンポーネント導入済み
        </Badge>
      </div>

      <Separator />

      {/* 2025年新規追加コンポーネント */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">2025年新規追加コンポーネント</h2>
          <p className="text-muted-foreground">
            shadcn/uiの最新アップデートで追加された7つのコンポーネント
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          {/* Button Group */}
          <Section
            title="Button Group"
            description="関連するボタンを一貫したスタイルでグループ化"
            isNew
          >
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <ButtonGroup>
                  <Button variant="outline">左</Button>
                  <Button variant="outline">中央</Button>
                  <Button variant="outline">右</Button>
                </ButtonGroup>

                <ButtonGroup orientation="vertical">
                  <Button variant="outline">上</Button>
                  <Button variant="outline">中</Button>
                  <Button variant="outline">下</Button>
                </ButtonGroup>

                <ButtonGroup>
                  <Button variant="default">保存</Button>
                  <Button variant="outline">キャンセル</Button>
                  <Button variant="destructive">削除</Button>
                </ButtonGroup>
              </div>

              <CodeBlock>
{`<ButtonGroup>
  <Button variant="outline">左</Button>
  <Button variant="outline">中央</Button>
  <Button variant="outline">右</Button>
</ButtonGroup>`}
              </CodeBlock>
            </div>
          </Section>

          {/* Spinner */}
          <Section
            title="Spinner"
            description="ローディング状態を表示するインジケーター"
            isNew
          >
            <div className="space-y-4">
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <Spinner className="size-4" />
                  <span className="text-muted-foreground text-xs">Small</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner className="size-6" />
                  <span className="text-muted-foreground text-xs">Medium</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner className="size-8" />
                  <span className="text-muted-foreground text-xs">Large</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleLoadingDemo} disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner className="size-4" />
                      読み込み中...
                    </>
                  ) : (
                    'ローディングをテスト'
                  )}
                </Button>
              </div>

              <CodeBlock>
{`<Button disabled={loading}>
  {loading ? (
    <>
      <Spinner className="size-4" />
      読み込み中...
    </>
  ) : (
    'ボタン'
  )}
</Button>`}
              </CodeBlock>
            </div>
          </Section>

          {/* Input Group */}
          <Section
            title="Input Group"
            description="入力フィールドに追加情報やアクションを表示"
            isNew
          >
            <div className="space-y-4">
              <div className="space-y-3">
                <InputGroup>
                  <InputGroupAddon>
                    <Search className="size-4" />
                  </InputGroupAddon>
                  <Input
                    placeholder="検索..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </InputGroup>

                <InputGroup>
                  <InputGroupAddon>https://</InputGroupAddon>
                  <Input placeholder="example.com" />
                </InputGroup>

                <InputGroup>
                  <Input placeholder="メールアドレスを入力" />
                  <InputGroupButton>
                    <Button size="sm">送信</Button>
                  </InputGroupButton>
                </InputGroup>

                <InputGroup>
                  <InputGroupAddon>
                    <Mail className="size-4" />
                  </InputGroupAddon>
                  <Input type="email" placeholder="email@example.com" />
                  <InputGroupAddon>.com</InputGroupAddon>
                </InputGroup>
              </div>

              <CodeBlock>
{`<InputGroup>
  <InputGroupAddon>
    <Search className="size-4" />
  </InputGroupAddon>
  <Input placeholder="検索..." />
</InputGroup>`}
              </CodeBlock>
            </div>
          </Section>

          {/* Field */}
          <Section
            title="Field"
            description="ラベル、コントロール、ヘルプテキストを組み合わせたアクセシブルなフォームフィールド"
            isNew
          >
            <div className="space-y-4">
              <Field>
                <FieldLabel>メールアドレス</FieldLabel>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={emailValue}
                  onChange={(e) => handleFieldValidation(e.target.value)}
                  aria-invalid={!!fieldError}
                />
                <FieldDescription>
                  アカウント登録に使用するメールアドレスを入力してください
                </FieldDescription>
                {fieldError && <FieldError>{fieldError}</FieldError>}
              </Field>

              <Field>
                <FieldLabel>プロフィール</FieldLabel>
                <Textarea placeholder="自己紹介を入力してください" rows={4} />
                <FieldDescription>
                  最大200文字まで入力できます
                </FieldDescription>
              </Field>

              <CodeBlock>
{`<Field>
  <FieldLabel>メールアドレス</FieldLabel>
  <Input type="email" placeholder="email@example.com" />
  <FieldDescription>
    アカウント登録に使用するメールアドレス
  </FieldDescription>
  {error && <FieldError>{error}</FieldError>}
</Field>`}
              </CodeBlock>
            </div>
          </Section>

          {/* Item */}
          <Section
            title="Item"
            description="リストアイテムやメニュー項目を表示する多目的コンポーネント"
            isNew
          >
            <div className="space-y-4">
              <ItemGroup>
                <Item>
                  <ItemMedia>
                    <Inbox className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>受信トレイ</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>128</ItemDescription>
                  </ItemContent>
                </Item>
                <Item>
                  <ItemMedia>
                    <FileText className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>下書き</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>9</ItemDescription>
                  </ItemContent>
                </Item>
                <Item>
                  <ItemMedia>
                    <Star className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>スター付き</ItemTitle>
                  </ItemContent>
                  <ItemContent>
                    <ItemDescription>24</ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>

              <Separator />

              <ItemGroup>
                <Item>
                  <ItemMedia variant="image">
                    <User className="size-full rounded-full bg-slate-200 p-1.5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>田中太郎</ItemTitle>
                    <ItemDescription>tanaka@example.com</ItemDescription>
                  </ItemContent>
                </Item>
                <Item>
                  <ItemMedia variant="icon">
                    <Heart className="text-red-600" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>お気に入り</ItemTitle>
                    <ItemDescription>42個のアイテム</ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>

              <CodeBlock>
{`<ItemGroup>
  <Item>
    <ItemMedia>
      <Inbox className="size-5" />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>受信トレイ</ItemTitle>
    </ItemContent>
    <ItemContent>
      <ItemDescription>128</ItemDescription>
    </ItemContent>
  </Item>
</ItemGroup>`}
              </CodeBlock>
            </div>
          </Section>

          {/* Kbd */}
          <Section
            title="Kbd"
            description="キーボードショートカットやキー入力を表示"
            isNew
          >
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">コピー:</span>
                  <Kbd>⌘</Kbd>
                  <span>+</span>
                  <Kbd>C</Kbd>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">ペースト:</span>
                  <Kbd>⌘</Kbd>
                  <span>+</span>
                  <Kbd>V</Kbd>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">検索:</span>
                  <Kbd>⌘</Kbd>
                  <span>+</span>
                  <Kbd>K</Kbd>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">保存:</span>
                  <Kbd>Ctrl</Kbd>
                  <span>+</span>
                  <Kbd>S</Kbd>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <p className="text-sm">
                  <Kbd>Tab</Kbd> キーを押してフォーカスを移動し、
                  <Kbd>Enter</Kbd> で選択してください。
                </p>
              </div>

              <CodeBlock>
{`<div className="flex items-center gap-2">
  <span>保存:</span>
  <Kbd>⌘</Kbd>
  <span>+</span>
  <Kbd>S</Kbd>
</div>`}
              </CodeBlock>
            </div>
          </Section>

          {/* Empty */}
          <Section
            title="Empty"
            description="データがない状態やエラー状態を表示"
            isNew
          >
            <div className="space-y-4">
              <Empty className="border">
                <div className="flex flex-col items-center gap-4">
                  <Calendar className="size-12 text-muted-foreground" />
                  <div className="space-y-2 text-center">
                    <h3 className="font-semibold">イベントがありません</h3>
                    <p className="text-muted-foreground text-sm">
                      新しいイベントを作成して始めましょう
                    </p>
                  </div>
                  <Button>イベントを作成</Button>
                </div>
              </Empty>

              <Empty className="border">
                <div className="flex flex-col items-center gap-4">
                  <Search className="size-12 text-muted-foreground" />
                  <div className="space-y-2 text-center">
                    <h3 className="font-semibold">検索結果が見つかりません</h3>
                    <p className="text-muted-foreground text-sm">
                      別のキーワードで検索してみてください
                    </p>
                  </div>
                </div>
              </Empty>

              <CodeBlock>
{`<Empty>
  <div className="flex flex-col items-center gap-4">
    <Calendar className="size-12" />
    <div className="space-y-2 text-center">
      <h3 className="font-semibold">データがありません</h3>
      <p>新しいアイテムを作成して始めましょう</p>
    </div>
    <Button>作成</Button>
  </div>
</Empty>`}
              </CodeBlock>
            </div>
          </Section>
        </div>
      </div>

      <Separator />

      {/* その他の追加コンポーネント */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">その他の追加コンポーネント</h2>
          <p className="text-muted-foreground">
            データビジュアライゼーションなど、実用的なコンポーネント
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          {/* Chart */}
          <Section
            title="Chart"
            description="Rechartsを使用した美しいチャートコンポーネント"
          >
            <div className="space-y-4">
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                </BarChart>
              </ChartContainer>

              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="size-4" />
                <span className="text-muted-foreground">
                  月次デスクトップアクセス数の推移
                </span>
              </div>

              <CodeBlock>
{`const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

<ChartContainer config={chartConfig}>
  <BarChart data={chartData}>
    <XAxis dataKey="month" />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" />
  </BarChart>
</ChartContainer>`}
              </CodeBlock>
            </div>
          </Section>
        </div>
      </div>

      {/* フッター */}
      <Separator />
      <div className="rounded-lg bg-slate-50 p-6 dark:bg-slate-900">
        <div className="space-y-2">
          <h3 className="font-semibold">インストール方法</h3>
          <p className="text-muted-foreground text-sm">
            これらのコンポーネントは shadcn/ui CLI でインストールできます：
          </p>
          <CodeBlock>
{`npx shadcn@latest add button-group
npx shadcn@latest add empty
npx shadcn@latest add field
npx shadcn@latest add input-group
npx shadcn@latest add item
npx shadcn@latest add kbd
npx shadcn@latest add spinner
npx shadcn@latest add chart`}
          </CodeBlock>
        </div>
      </div>
    </div>
  );
}
