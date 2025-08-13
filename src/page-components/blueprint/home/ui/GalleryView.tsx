import Link from "next/link";
import { Card, CardContent, Badge } from "@/shared/shadcnui";


interface Blueprint {
  filename: string;
  orderSource: string;
  productName: string;
  internalNumber: string;
  customerNumber: string;
  cadName: string;
  camName: string;
  orderQuantity: number;
  orderDate: string;
  deliveryDate: string;
  maxDimensionL: number;
  maxDimensionD: number;
  maxDimensionH: number;
  companyField: string;
  image: string;
}

interface GalleryViewProps {
  blueprints: Blueprint[];
}

export function GalleryView({ blueprints }: GalleryViewProps) {
  return (
    <div className="overflow-auto flex-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3n mb gap-6 p-1">
      {blueprints.map((blueprint) => (
        <Link key={blueprint.internalNumber} href={`/project/${blueprint.internalNumber}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 group cursor-pointer p-0">
            <div className="aspect-video overflow-hidden bg-gray-100">
              <img
                src={blueprint.image}
                alt={blueprint.productName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">
                  {blueprint.orderSource}
                </p>
                <Badge variant="outline" className="text-xs">
                  {blueprint.companyField}
                </Badge>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">
                {blueprint.productName}
              </h3>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono text-xs">
                  {blueprint.customerNumber}
                </Badge>
                <span className="text-xs text-gray-500">
                  {blueprint.orderQuantity}個
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {blueprint.orderDate} 〜 {blueprint.deliveryDate}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
      </div>
    </div>
  );
}