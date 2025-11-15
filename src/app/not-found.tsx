import Link from 'next/link';
import { Button } from '@/shared';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='flex min-h-[calc(100vh-60px)] items-center justify-center bg-gray-50'>
      <div className='w-full max-w-md px-6 text-center'>
        <div className='mb-8'>
          {/* 404 Number */}
          <h1 className='text-primary/20 text-9xl leading-none font-bold'>
            404
          </h1>

          {/* Main Message */}
          <h2 className='mt-4 text-2xl font-semibold text-gray-900'>
            ページが見つかりません
          </h2>

          {/* Description */}
          <p className='mt-4 leading-relaxed text-gray-600'>
            申し訳ございません。お探しのページは存在しないか、
            移動または削除された可能性があります。
          </p>
        </div>

        {/* Action Buttons */}
        <div className='space-y-3'>
          <Button asChild className='w-full'>
            <Link href='/'>
              <Home className='mr-2 h-4 w-4' />
              ホームに戻る
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
