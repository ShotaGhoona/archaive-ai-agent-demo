'use client';
import { useState } from 'react';
import {
  ResizableLayout,
  ResizablePanel,
  ResizableHandle,
  Button,
} from '@/shared';
import {
  twoColumnConfig,
  threeColumnConfig,
  fourColumnConfig,
  threeRowConfig,
  fiveColumnConfig,
} from './lib/testResizableConfigs';

type ConfigType = 'two' | 'three' | 'four' | 'vertical' | 'five';

const configMap = {
  two: { config: twoColumnConfig, name: '2パネル（水平）' },
  three: { config: threeColumnConfig, name: '3パネル（水平）' },
  four: { config: fourColumnConfig, name: '4パネル（水平）' },
  vertical: { config: threeRowConfig, name: '3パネル（垂直）' },
  five: { config: fiveColumnConfig, name: '5パネル（水平）' },
};

export default function ResizePanelTestPage() {
  const [currentConfig, setCurrentConfig] = useState<ConfigType>('two');

  const renderPanels = () => {
    const config = configMap[currentConfig].config;
    const panels = [];

    for (let i = 0; i < config.panels.length; i++) {
      // パネルを追加
      panels.push(
        <ResizablePanel key={`panel-${i}`} index={i}>
          <div className='h-full border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4'>
            <div className='mb-2 font-bold text-blue-800'>パネル {i + 1}</div>
            <div className='text-sm text-blue-600'>
              <div>Index: {i}</div>
              <div>
                初期サイズ:{' '}
                {config.direction === 'horizontal'
                  ? config.panels[i].initialWidth
                  : config.panels[i].initialHeight}
                %
              </div>
              <div>
                最小:{' '}
                {config.direction === 'horizontal'
                  ? config.panels[i].minWidth
                  : config.panels[i].minHeight}
                %
              </div>
              <div>
                最大:{' '}
                {config.direction === 'horizontal'
                  ? config.panels[i].maxWidth
                  : config.panels[i].maxHeight}
                %
              </div>
            </div>
            <div className='mt-4 rounded border bg-white p-2'>
              <p className='text-xs text-gray-600'>
                このパネルをリサイズできます。
                {config.direction === 'horizontal' ? '左右' : '上下'}
                のハンドルをドラッグしてください。
              </p>
            </div>
          </div>
        </ResizablePanel>,
      );

      // 最後のパネル以外はハンドルを追加
      if (i < config.panels.length - 1) {
        panels.push(<ResizableHandle key={`handle-${i}`} />);
      }
    }

    return panels;
  };

  return (
    <div className='flex h-screen flex-col bg-gray-50'>
      {/* ヘッダー */}
      <div className='flex-shrink-0 border-b bg-white p-4 shadow-sm'>
        <h1 className='mb-4 text-2xl font-bold text-gray-800'>
          ResizableLayout テストページ
        </h1>
        <div className='flex flex-wrap gap-2'>
          {Object.entries(configMap).map(([key, { name }]) => (
            <Button
              key={key}
              variant={currentConfig === key ? 'default' : 'outline'}
              size='sm'
              onClick={() => setCurrentConfig(key as ConfigType)}
              className='text-xs'
            >
              {name}
            </Button>
          ))}
        </div>
        <div className='mt-2 text-sm text-gray-600'>
          現在のレイアウト: <strong>{configMap[currentConfig].name}</strong>
          {' - '}パネル数: {configMap[currentConfig].config.panels.length}
          {' - '}方向:{' '}
          {configMap[currentConfig].config.direction === 'horizontal'
            ? '水平'
            : '垂直'}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className='flex-1 p-4'>
        <div className='h-full overflow-hidden rounded-lg border border-gray-300 shadow-lg'>
          <ResizableLayout
            key={currentConfig} // 設定変更時にコンポーネントをリセット
            config={configMap[currentConfig].config}
            className='h-full'
          >
            {renderPanels()}
          </ResizableLayout>
        </div>
      </div>

      {/* フッター情報 */}
      <div className='flex-shrink-0 border-t bg-white p-4 text-xs text-gray-500'>
        <div className='flex gap-8'>
          <div>
            <strong>使い方:</strong>{' '}
            ハンドル（グレーの縦線/横線）をドラッグしてパネルをリサイズ
          </div>
          <div>
            <strong>制約:</strong> 各パネルには最小・最大サイズの制限があります
          </div>
        </div>
      </div>
    </div>
  );
}
