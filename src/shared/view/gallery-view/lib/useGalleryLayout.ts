import { useMemo } from 'react';
import { GalleryLayoutConfig, GridClass, AspectRatioClass } from '../model';

export const useGalleryLayout = (layoutConfig: GalleryLayoutConfig) => {
  // グリッドクラスを動的生成
  const gridClasses = useMemo((): GridClass => {
    const classes = ['grid'];

    if (layoutConfig.grid.xs) classes.push(`grid-cols-${layoutConfig.grid.xs}`);
    if (layoutConfig.grid.sm)
      classes.push(`sm:grid-cols-${layoutConfig.grid.sm}`);
    if (layoutConfig.grid.md)
      classes.push(`md:grid-cols-${layoutConfig.grid.md}`);
    if (layoutConfig.grid.lg)
      classes.push(`lg:grid-cols-${layoutConfig.grid.lg}`);
    if (layoutConfig.grid.xl)
      classes.push(`xl:grid-cols-${layoutConfig.grid.xl}`);

    return classes.join(' ');
  }, [layoutConfig.grid]);

  // アスペクト比クラスを取得
  const aspectRatioClass = useMemo((): AspectRatioClass => {
    switch (layoutConfig.aspectRatio) {
      case 'video':
        return 'aspect-video';
      case 'square':
        return 'aspect-square';
      case '4/3':
        return 'aspect-[4/3]';
      case 'auto':
        return 'aspect-auto';
      default:
        // カスタムアスペクト比の場合はそのまま返す
        return layoutConfig.aspectRatio;
    }
  }, [layoutConfig.aspectRatio]);

  return {
    gridClasses,
    aspectRatioClass,
  };
};
