"use client";

import { useState } from "react";
import { Card, CardContent, Button } from "@/shared";
import { FileText } from "lucide-react";
import { OrderData } from "../model";
import { OrderRegistrationDialog } from "./OrderRegistrationDialog";

interface OrderListProps {
  orders: OrderData[];
  selectedId: string;
  onSelectOrder: (order: OrderData) => void;
}

export function OrderList({ orders, selectedId, onSelectOrder }: OrderListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelectOrder = (order: OrderData) => {
    onSelectOrder(order);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="h-full bg-white border-r flex flex-col">
      <div className="flex-1 p-4 pt-0 space-y-4 mt-4">
        <Button 
          size="lg" 
          variant="outline" 
          className="w-full py-8"
          onClick={handleOpenDialog}
        >
          <FileText className="h-4 w-4 mr-2" />
          受注書を登録or作成
        </Button>
        {orders
          .sort((a, b) => new Date(b.modified_date).getTime() - new Date(a.modified_date).getTime())
          .map((order) => (
          <Card 
            key={order.order_id}
            onClick={() => handleSelectOrder(order)}
            className={`
              cursor-pointer transition-all duration-200 group relative py-1
              ${selectedId === order.order_id 
                ? 'ring-2 ring-primary' 
                : 'hover:shadow-md hover:bg-gray-50'
              }
            `}
          >
            <CardContent className="p-2">
              <div className="space-y-2">
                <div className="aspect-video w-full bg-gray-100 rounded overflow-hidden">
                  {order.image_url ? (
                    <img 
                      src={order.image_url} 
                      alt={order.order_number}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="px-1">
                  <h4 className="text-xs font-medium text-gray-900 truncate">
                    {order.order_number}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.created_date).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <OrderRegistrationDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </div>
  );
}