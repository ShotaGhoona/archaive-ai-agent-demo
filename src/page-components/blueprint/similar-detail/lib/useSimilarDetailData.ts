'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { blueprintDetailData } from '@/dummy-data-er-fix/blueprint';
import { BlueprintDetailDataInterface } from '@/dummy-data-er-fix/blueprint/interfaces/types';
import { TargetBlueprintData } from '../model';

export function useSimilarDetailData(initialBlueprintId?: number) {
  const searchParams = useSearchParams();
  const [targetBlueprint, setTargetBlueprint] = useState<TargetBlueprintData>({
    blueprint: null,
    isUploaded: false,
  });
  const [similarBlueprints, setSimilarBlueprints] = useState<
    BlueprintDetailDataInterface[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // URLパラメータから取得
      const uploadedParam = searchParams.get('uploaded');
      const blueprintIdParam = searchParams.get('blueprintId');

      if (uploadedParam === 'true') {
        // アップロードされた図面の場合
        // TODO: 実際のアップロードデータを取得する処理
        // 仮で最初のデータを使用
        setTargetBlueprint({
          blueprint: blueprintDetailData[0] as BlueprintDetailDataInterface,
          isUploaded: true,
        });
        // 全ての図面を類似図面として表示
        setSimilarBlueprints(
          blueprintDetailData as BlueprintDetailDataInterface[],
        );
      } else {
        // 登録済み図面の場合
        const blueprintId =
          blueprintIdParam !== null
            ? parseInt(blueprintIdParam, 10)
            : initialBlueprintId;

        if (blueprintId) {
          const blueprint = blueprintDetailData.find(
            (bp) => bp.id === blueprintId,
          ) as BlueprintDetailDataInterface | undefined;

          if (blueprint) {
            setTargetBlueprint({
              blueprint,
              isUploaded: false,
            });
            // 類似図面を取得
            setSimilarBlueprints(
              (blueprint.similar_blueprints ||
                []) as BlueprintDetailDataInterface[],
            );
          }
        } else {
          // デフォルトで最初の図面を使用
          const defaultBlueprint =
            blueprintDetailData[0] as BlueprintDetailDataInterface;
          setTargetBlueprint({
            blueprint: defaultBlueprint,
            isUploaded: false,
          });
          setSimilarBlueprints(
            (defaultBlueprint.similar_blueprints ||
              []) as BlueprintDetailDataInterface[],
          );
        }
      }

      setIsLoading(false);
    };

    loadData();
  }, [searchParams, initialBlueprintId]);

  return {
    targetBlueprint,
    similarBlueprints,
    isLoading,
  };
}
