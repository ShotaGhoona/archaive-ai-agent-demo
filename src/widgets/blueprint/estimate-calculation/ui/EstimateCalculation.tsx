'use client';
import React from 'react';
import { Button, Input } from '@/shared';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useEstimateCalculation } from '../lib/useEstimateCalculation';

interface EstimateCalculationProps {
  onSave?: (data: {
    materialCost: string;
    processingCost: string;
    setupCost: string;
    otherCost: string;
    totalCost: string;
  }) => void;
}

export function EstimateCalculation({
  onSave,
}: EstimateCalculationProps) {
  const { state, costs, actions } = useEstimateCalculation();

  // 保存処理
  const handleSave = () => {
    if (onSave) {
      const estimateData = {
        materialCost: costs.materialUnitCost.toString(),
        processingCost: costs.processUnitCost.toString(),
        setupCost: costs.setupUnitCost.toString(),
        otherCost: costs.otherCost.toString(),
        totalCost: costs.finalTotal.toString(),
      };
      onSave(estimateData);
    }
  };

  return (
    <div className={`flex h-full flex-col`}>
      <div className='flex-1 space-y-6 overflow-y-auto p-4'>
        {/* 1. 材料費 */}
        <div className='space-y-3'>
          <h3 className='text-lg font-semibold text-primary'>材料費</h3>
          <div className='rounded-lg border bg-gray-50 py-2'>
            {state.materials.map((material) => (
              <div
                key={material.id}
                className='flex items-center justify-between px-3 py-1'
              >
                <div className='flex items-center gap-3'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => actions.deleteMaterial(material.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                  <Input
                    value={material.name}
                    onChange={(e) =>
                      actions.updateMaterialField(
                        material.id,
                        'name',
                        e.target.value,
                      )
                    }
                    placeholder='材料名を入力'
                    className='w-48'
                  />
                </div>
                <div className='flex items-center gap-1'>
                  <Input
                    type='number'
                    value={material.price}
                    onChange={(e) =>
                      actions.updateMaterialField(
                        material.id,
                        'price',
                        Number(e.target.value),
                      )
                    }
                    className='w-24'
                    placeholder='0'
                  />
                  <span className='text-sm text-gray-600'>円/個</span>
                </div>
              </div>
            ))}
            <div className=''>
              <Button
                variant='ghost'
                onClick={actions.addMaterial}
                className='w-full'
              >
                <Plus className='mr-2 h-4 w-4' />
                材料を追加
              </Button>
            </div>
          </div>
        </div>

        {/* 2. 工程費 */}
        <div className='space-y-3'>
          <h3 className='text-lg font-semibold text-primary'>工程費</h3>
          <div className='rounded-lg border bg-gray-50 py-2'>
            {state.processes.map((process) => (
              <div
                key={process.id}
                className='flex items-center justify-between px-3 py-1'
              >
                <div className='flex items-center gap-3'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => actions.deleteProcess(process.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                  <Input
                    value={process.name}
                    onChange={(e) =>
                      actions.updateProcessField(
                        process.id,
                        'name',
                        e.target.value,
                      )
                    }
                    placeholder='工程名を入力'
                    className='w-40'
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <Input
                    type='number'
                    value={process.timeMinutes}
                    onChange={(e) =>
                      actions.updateProcessField(
                        process.id,
                        'timeMinutes',
                        Number(e.target.value),
                      )
                    }
                    className='w-16'
                    placeholder='0'
                  />
                  <span className='text-sm text-gray-600'>円/分</span>
                  <span className='text-sm text-gray-600'>×</span>
                  <Input
                    type='number'
                    value={process.chargeRate}
                    onChange={(e) =>
                      actions.updateProcessField(
                        process.id,
                        'chargeRate',
                        Number(e.target.value),
                      )
                    }
                    className='w-16'
                    placeholder='0'
                  />
                  <span className='text-sm text-gray-600'>分</span>
                  <span className='text-sm text-gray-600'>=</span>
                  <div className='min-w-[80px] text-right font-medium'>
                    {(
                      process.timeMinutes * process.chargeRate
                    ).toLocaleString()}
                    <span className='text-sm text-gray-600'>円/個</span>
                  </div>
                </div>
              </div>
            ))}
            <div className=''>
              <Button
                variant='ghost'
                onClick={actions.addProcess}
                className='w-full'
              >
                <Plus className='mr-2 h-4 w-4' />
                工程を追加
              </Button>
            </div>
          </div>
        </div>

        {/* 3. 段取り工程費用 */}
        <div className='space-y-3'>
          <h3 className='text-lg font-semibold text-primary'>段取工程費</h3>
          <div className='rounded-lg border bg-gray-50 py-2'>
            {state.setupCosts.map((cost) => (
              <div
                key={cost.id}
                className='flex items-center justify-between px-3 py-1'
              >
                <div className='flex items-center gap-3'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => actions.deleteSetupCost(cost.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                  <Input
                    value={cost.name}
                    onChange={(e) =>
                      actions.updateSetupCostField(
                        cost.id,
                        'name',
                        e.target.value,
                      )
                    }
                    placeholder='項目名を入力'
                    className='w-48'
                  />
                </div>
                <div className='flex items-center gap-1'>
                  <Input
                    type='number'
                    value={cost.price}
                    onChange={(e) =>
                      actions.updateSetupCostField(
                        cost.id,
                        'price',
                        Number(e.target.value),
                      )
                    }
                    className='w-24'
                    placeholder='0'
                  />
                  <span className='text-sm text-gray-600'>円/個</span>
                </div>
              </div>
            ))}
            <div className=''>
              <Button
                variant='ghost'
                onClick={actions.addSetupCost}
                className='w-full'
              >
                <Plus className='mr-2 h-4 w-4' />
                項目を追加
              </Button>
            </div>
          </div>
        </div>

        {/* 4. その他費用 */}
        <div className='space-y-3'>
          <h3 className='text-lg font-semibold text-primary'>その他</h3>
          <div className='rounded-lg border bg-gray-50 py-2'>
            {state.otherCosts.map((cost) => (
              <div
                key={cost.id}
                className='flex items-center justify-between px-3 py-1'
              >
                <div className='flex items-center gap-3'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => actions.deleteOtherCost(cost.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                  <Input
                    value={cost.name}
                    onChange={(e) =>
                      actions.updateOtherCostField(
                        cost.id,
                        'name',
                        e.target.value,
                      )
                    }
                    placeholder='項目名を入力'
                    className='w-48'
                  />
                </div>
                <div className='flex items-center gap-1'>
                  <Input
                    type='number'
                    value={cost.price}
                    onChange={(e) =>
                      actions.updateOtherCostField(
                        cost.id,
                        'price',
                        Number(e.target.value),
                      )
                    }
                    className='w-32'
                    placeholder='円'
                  />
                  <span className='text-sm text-gray-600'>円</span>
                </div>
              </div>
            ))}
            <div className=''>
              <Button
                variant='ghost'
                onClick={actions.addOtherCost}
                className='w-full'
              >
                <Plus className='mr-2 h-4 w-4' />
                項目を追加
              </Button>
            </div>
          </div>
        </div>

        {/* 5. 見積もり結果 */}
        {(state.materials.length > 0 ||
          state.processes.length > 0 ||
          state.setupCosts.length > 0 ||
          state.otherCosts.length > 0) && (
          <div className='space-y-3'>
            <h3 className='text-lg font-semibold text-primary'>見積もり結果</h3>
            <div className='bg-primary/10 border-primary/30 rounded-lg border p-4'>
              <div className='space-y-3'>
                {state.materials.length > 0 && (
                  <div className='flex items-center justify-between'>
                    <span>材料費:</span>
                    <div className='flex items-center gap-2'>
                      <span>
                        {costs.materialUnitCost.toLocaleString()}
                        <span className='text-sm text-gray-600'>円/個</span>
                      </span>
                      <span className='text-sm text-gray-600'>×</span>
                      <Input
                        type='number'
                        value={state.quantities.material}
                        onChange={(e) =>
                          actions.updateMaterialQuantity(Number(e.target.value))
                        }
                        className='w-16'
                        min='1'
                        placeholder='1'
                      />
                      <span className='text-sm text-gray-600'>個</span>
                      <span className='text-sm text-gray-600'>=</span>
                      <span className='min-w-[80px] text-right font-medium'>
                        {costs.materialTotalCost.toLocaleString()}
                        <span className='text-sm text-gray-600'>円</span>
                      </span>
                    </div>
                  </div>
                )}

                {state.processes.length > 0 && (
                  <div className='flex items-center justify-between'>
                    <span>工程費:</span>
                    <div className='flex items-center gap-2'>
                      <span>
                        {costs.processUnitCost.toLocaleString()}
                        <span className='text-sm text-gray-600'>円/個</span>
                      </span>
                      <span className='text-sm text-gray-600'>×</span>
                      <Input
                        type='number'
                        value={state.quantities.process}
                        onChange={(e) =>
                          actions.updateProcessQuantity(Number(e.target.value))
                        }
                        className='w-16'
                        min='1'
                        placeholder='1'
                      />
                      <span className='text-sm text-gray-600'>個</span>
                      <span className='text-sm text-gray-600'>=</span>
                      <span className='min-w-[80px] text-right font-medium'>
                        {costs.processTotalCost.toLocaleString()}
                        <span className='text-sm text-gray-600'>円</span>
                      </span>
                    </div>
                  </div>
                )}

                {state.setupCosts.length > 0 && (
                  <div className='flex items-center justify-between'>
                    <span>段取工程費:</span>
                    <div className='flex items-center gap-2'>
                      <span>
                        {costs.setupUnitCost.toLocaleString()}
                        <span className='text-sm text-gray-600'>円/個</span>
                      </span>
                      <span className='text-sm text-gray-600'>×</span>
                      <Input
                        type='number'
                        value={state.quantities.setup}
                        onChange={(e) =>
                          actions.updateSetupQuantity(Number(e.target.value))
                        }
                        className='w-16'
                        min='1'
                        placeholder='1'
                      />
                      <span className='text-sm text-gray-600'>個</span>
                      <span className='text-sm text-gray-600'>=</span>
                      <span className='min-w-[80px] text-right font-medium'>
                        {costs.setupTotalCost.toLocaleString()}
                        <span className='text-sm text-gray-600'>円</span>
                      </span>
                    </div>
                  </div>
                )}

                {state.otherCosts.length > 0 && (
                  <div className='flex items-center justify-between'>
                    <span>その他:</span>
                    <span>
                      {costs.otherCost.toLocaleString()}
                      <span className='text-sm text-gray-600'>円</span>
                    </span>
                  </div>
                )}
                <div className='border-primary/30 flex justify-between border-t pt-2 text-lg font-bold'>
                  <span>合計:</span>
                  <span>
                    {costs.finalTotal.toLocaleString()}
                    <span className='text-sm text-gray-600'>円</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {onSave && (
        <div className='border-t p-4'>
          <Button onClick={handleSave} className='w-full gap-2'>
            <Save className='h-4 w-4' />
            見積もりを確定
          </Button>
        </div>
      )}
    </div>
  );
}
