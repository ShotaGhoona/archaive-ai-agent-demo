"use client";
import { Upload } from "lucide-react";
import registerBlueprintsData from "../data/registerBlueprints.json";

interface RegisterBlueprint {
  id: string;
  filename: string;
  productName: string;
  thumbnailUrl: string;
  uploadDate: string;
}

export default function BlueprintUploadGallery() {
  const blueprints: RegisterBlueprint[] = registerBlueprintsData;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log("Files selected:", files);
      // TODO: ファイルアップロード処理を実装
    }
  };

  return (
    <div className="flex flex-col p-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
        <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group">
          <input
            type="file"
            multiple
            accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png,.tif,.tiff"
            onChange={handleFileUpload}
            className="hidden"
            id="fileUpload"
          />
          <label htmlFor="fileUpload" className="block p-4 cursor-pointer">
            <div className="aspect-square flex items-center justify-center">
              <div className="text-center">
                <Upload className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600 mb-1 transition-colors">
                  アップロード
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DWG, DXF
                </p>
              </div>
            </div>
          </label>
        </div>
        {blueprints.map((blueprint) => (
          <div
            key={blueprint.id}
            className="border rounded-lg p-2 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="aspect-square mb-2 overflow-hidden rounded bg-gray-100">
              <img
                src={blueprint.thumbnailUrl}
                alt={blueprint.filename}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium truncate" title={blueprint.filename}>
                {blueprint.filename}
              </p>
              <p className="text-xs text-gray-500 truncate" title={blueprint.productName}>
                {blueprint.productName}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}