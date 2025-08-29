"use client";

import { useState, useEffect } from "react";
import { ResizableLayout, ResizablePanel, ResizableHandle, LoadingScreen } from "@/shared";
import { orderResizableLayoutConfig } from "../lib";
import { OrderData } from "../model";
import { orderData as initialOrderData } from "../data";
import { OrderList, OrderPreview, OrderInfoPanel } from "../ui";

export function OrderContainer() {
  const [orders] = useState<OrderData[]>(initialOrderData as OrderData[]);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    if (orders.length > 0 && !selectedOrder) {
      setSelectedOrder(orders[0]);
    }
  }, [orders, selectedOrder]);

  const handleSelectOrder = (order: OrderData) => {
    setSelectedOrder(order);
  };

  const handleUpdateOrder = (data: Partial<OrderData>) => {
    if (!selectedOrder) return;
    
    const updatedOrder = { ...selectedOrder, ...data };
    setSelectedOrder(updatedOrder);
    
    console.log("受注書データを更新:", updatedOrder);
  };

  if (!selectedOrder) {
    return <LoadingScreen message="受注書を読み込み中..." className="h-full" />;
  }

  return (
    <div className="h-full flex">
      <div className="w-60 flex-shrink-0">
        <OrderList 
          orders={orders}
          selectedId={selectedOrder.order_id}
          onSelectOrder={handleSelectOrder} 
        />
      </div>

      <div className="flex-1">
        <ResizableLayout config={orderResizableLayoutConfig} className="h-full">
          <ResizablePanel index={0}>
            <div className="h-full overflow-hidden">
              <OrderPreview imageUrl={selectedOrder.image_url} />
            </div>
          </ResizablePanel>
          
          <ResizableHandle />
          
          <ResizablePanel index={1}>
            <div className="h-full overflow-hidden">
              <OrderInfoPanel 
                orderData={selectedOrder}
                onUpdate={handleUpdateOrder}
              />
            </div>
          </ResizablePanel>
        </ResizableLayout>
      </div>
    </div>
  );
}