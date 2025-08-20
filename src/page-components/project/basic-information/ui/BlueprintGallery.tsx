"use client";
import Link from "next/link";
import { Blueprint } from "@/page-components/blueprint/home/lib/blueprintColumns";

interface BlueprintGalleryProps {
  blueprints: Blueprint[];
}

export default function BlueprintGallery({ blueprints }: BlueprintGalleryProps) {
  return (
    <div className="bg-white flex flex-col p-6">
      <h3 className="text-lg font-semibold mb-4">登録図面</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto">
        {blueprints.map((blueprint) => (
          <Link
            key={blueprint.internalNumber}
            href={`/blueprint/${blueprint.internalNumber}/basic-information`}
            className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer block"
          >
            <div className="aspect-square mb-2 overflow-hidden rounded bg-gray-100">
              <img
                src="https://jp.meviy.misumi-ec.com/info/ja/wp-content/uploads/2022/04/y1-1.jpg"
                alt={blueprint.filename}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium truncate" title={blueprint.filename}>
                {blueprint.filename}
              </p>
              <p className="text-xs text-gray-500 truncate" title={blueprint.productName}>
                {blueprint.productName}
              </p>
            </div>
          </Link>
        ))}
      </div>
      
      {blueprints.length === 0 && (
        <div className="flex items-center justify-center h-64 text-gray-500">
          登録されている図面はありません
        </div>
      )}
    </div>
  );
}