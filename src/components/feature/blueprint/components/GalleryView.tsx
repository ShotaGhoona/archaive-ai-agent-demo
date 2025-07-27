import Link from "next/link";
import { Card, CardContent, Badge } from "@/components/ui";

const getStatusColor = (status: string) => {
  switch (status) {
    case "設計中":
      return "bg-yellow-100 text-yellow-800";
    case "承認済み":
      return "bg-green-100 text-green-800";
    case "製作中":
      return "bg-blue-100 text-blue-800";
    case "完了":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

interface Blueprint {
  id: string;
  customerName: string;
  productName: string;
  drawing: string;
  material: string;
  status: string;
  image: string;
}

interface GalleryViewProps {
  blueprints: Blueprint[];
}

export function GalleryView({ blueprints }: GalleryViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {blueprints.map((blueprint) => (
        <Link key={blueprint.id} href={`/blueprints/${blueprint.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 group cursor-pointer">
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
                  {blueprint.customerName}
                </p>
                <Badge className={getStatusColor(blueprint.status) + " text-xs"}>
                  {blueprint.status}
                </Badge>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">
                {blueprint.productName}
              </h3>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono text-xs">
                  {blueprint.drawing}
                </Badge>
                <span className="text-xs text-gray-500">
                  {blueprint.material}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}