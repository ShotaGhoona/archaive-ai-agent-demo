import Link from 'next/link';
import { Button } from '@/shared';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-45px)] flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center px-6">
        <div className="mb-8">
          {/* 404 Number */}
          <h1 className="text-9xl font-bold text-primary/20 leading-none">
            404
          </h1>
          
          {/* Main Message */}
          <h2 className="text-2xl font-semibold text-gray-900 mt-4">
            ページが見つかりません
          </h2>
          
          {/* Description */}
          <p className="text-gray-600 mt-4 leading-relaxed">
            申し訳ございません。お探しのページは存在しないか、
            移動または削除された可能性があります。
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            asChild 
            className="w-full"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              ホームに戻る
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            asChild 
            className="w-full"
          >
            <Link href="/blueprint">
              <ArrowLeft className="w-4 h-4 mr-2" />
              図面管理に戻る
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}