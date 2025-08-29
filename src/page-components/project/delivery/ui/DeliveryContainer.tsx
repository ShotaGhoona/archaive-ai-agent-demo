"use client";

import { useState, useEffect } from "react";
import { ResizableLayout, ResizablePanel, ResizableHandle, LoadingScreen } from "@/shared";
import { deliveryResizableLayoutConfig } from "../lib";
import { DeliveryData } from "../model";
import { deliveryData as initialDeliveryData } from "../data";
import { DeliveryList, DeliveryPreview, DeliveryInfoPanel } from "../ui";

export function DeliveryContainer() {
  const [deliveries] = useState<DeliveryData[]>(initialDeliveryData as DeliveryData[]);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryData | null>(null);

  useEffect(() => {
    if (deliveries.length > 0 && !selectedDelivery) {
      setSelectedDelivery(deliveries[0]);
    }
  }, [deliveries, selectedDelivery]);

  const handleSelectDelivery = (delivery: DeliveryData) => {
    setSelectedDelivery(delivery);
  };

  const handleUpdateDelivery = (data: Partial<DeliveryData>) => {
    if (!selectedDelivery) return;
    
    const updatedDelivery = { ...selectedDelivery, ...data };
    setSelectedDelivery(updatedDelivery);
    
    console.log("納品書データを更新:", updatedDelivery);
  };

  if (!selectedDelivery) {
    return <LoadingScreen message="納品書を読み込み中..." className="h-full" />;
  }

  return (
    <div className="h-full flex">
      <div className="w-60 flex-shrink-0">
        <DeliveryList 
          deliveries={deliveries}
          selectedId={selectedDelivery.delivery_id}
          onSelectDelivery={handleSelectDelivery} 
        />
      </div>

      <div className="flex-1">
        <ResizableLayout config={deliveryResizableLayoutConfig} className="h-full">
          <ResizablePanel index={0}>
            <div className="h-full overflow-hidden">
              <DeliveryPreview imageUrl={selectedDelivery.image_url} />
            </div>
          </ResizablePanel>
          
          <ResizableHandle />
          
          <ResizablePanel index={1}>
            <div className="h-full overflow-hidden">
              <DeliveryInfoPanel 
                deliveryData={selectedDelivery}
                onUpdate={handleUpdateDelivery}
              />
            </div>
          </ResizablePanel>
        </ResizableLayout>
      </div>
    </div>
  );
}