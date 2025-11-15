import { Suspense } from 'react';
import { BlueprintSimilarDetailContainer } from '@/page-components/blueprint/similar-detail/ui';
import { Loading } from '@/shared';

export default function BlueprintSimilarDetailPage() {
  return (
    <Suspense
      fallback={
        <Loading
          title='読み込み中...'
          description='ページを読み込んでいます'
          fullHeight
        />
      }
    >
      <BlueprintSimilarDetailContainer />
    </Suspense>
  );
}
