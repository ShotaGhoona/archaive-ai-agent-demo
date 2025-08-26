"use client";
import React, { useState } from 'react';
import { Button, LoadingSpinner, LoadingScreen, PageLoading, LoadingSkeleton } from '@/shared';

export default function TestPage() {
  const [showFullScreen, setShowFullScreen] = useState(false);

  const handleShowFullScreen = () => {
    setShowFullScreen(true);
    setTimeout(() => {
      setShowFullScreen(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ローディングコンポーネントテスト</h1>
        <p className="text-gray-600">統一されたローディング画面の確認ページです</p>
      </div>

      {/* LoadingSpinner */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">LoadingSpinner</h2>
        <div className="flex items-center space-x-8">
          <div className="text-center">
            <LoadingSpinner size="sm" />
            <p className="text-sm mt-2 text-gray-600">Small</p>
          </div>
          <div className="text-center">
            <LoadingSpinner size="md" />
            <p className="text-sm mt-2 text-gray-600">Medium</p>
          </div>
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-sm mt-2 text-gray-600">Large</p>
          </div>
        </div>
      </div>

      {/* LoadingScreen */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">LoadingScreen</h2>
        <div className="border rounded-lg p-4">
          <LoadingScreen message="データを読み込んでいます..." />
        </div>
      </div>

      {/* PageLoading */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">PageLoading</h2>
        <div className="space-y-4">
          <div className="border rounded-lg h-40">
            <PageLoading message="ページを読み込み中..." />
          </div>
          <Button 
            onClick={handleShowFullScreen}
            className="w-full"
          >
            フルスクリーンローディングを3秒間表示
          </Button>
        </div>
      </div>

      {/* LoadingSkeleton */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">LoadingSkeleton</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">3行のスケルトン</h3>
            <LoadingSkeleton rows={3} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">5行のスケルトン</h3>
            <LoadingSkeleton rows={5} />
          </div>
        </div>
      </div>

      {/* 使用例 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">使用例</h2>
        <div className="space-y-2 text-sm font-mono text-gray-700">
          <p>import {`{ LoadingSpinner, LoadingScreen, PageLoading, LoadingSkeleton }`} from &apos;@/shared&apos;;</p>
          <p>&lt;LoadingSpinner size=&quot;md&quot; /&gt;</p>
          <p>&lt;LoadingScreen message=&quot;データを読み込んでいます...&quot; /&gt;</p>
          <p>&lt;PageLoading fullScreen=&#123;true&#125; /&gt;</p>
          <p>&lt;LoadingSkeleton rows=&#123;3&#125; /&gt;</p>
        </div>
      </div>

      {/* フルスクリーンローディング */}
      {showFullScreen && (
        <PageLoading 
          message="フルスクリーンローディングのテスト中..." 
          fullScreen={true}
        />
      )}
    </div>
  );
}