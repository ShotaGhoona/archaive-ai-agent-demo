"use client";

import { useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import BlueprintSidebar, { getSidebarMenus } from "@/components/common/BlueprintSidebar";
import blueprintsData from "@/components/feature/blueprint/data/blueprint.json";

export default function BlueprintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const blueprintId = params.id as string;
  
  const blueprint = blueprintsData.find((item) => item.id === blueprintId);

  if (!blueprint) {
    return (
      <div className="bg-background min-h-calc(100vh-45px) flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            図面が見つかりません
          </h2>
          <p className="text-gray-600 mb-4">
            指定された図面IDが存在しないか、削除されている可能性があります。
          </p>
          <Link href="/blueprints">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              図面一覧に戻る
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 現在のページを判定
  const getCurrentPage = () => {
    if (pathname.includes('/process')) return 'process';
    if (pathname.includes('/project')) return 'project';
    if (pathname.includes('/quotation')) return 'quotation';
    if (pathname.includes('/order')) return 'order';
    if (pathname.includes('/delivery')) return 'delivery';
    if (pathname.includes('/inspection')) return 'inspection';
    if (pathname.includes('/specification')) return 'specification';
    return 'overview';
  };

  const currentPage = getCurrentPage();

  const sidebarHeaderContent = (
    <div className="space-y-5">
      <Link href="/blueprints">
        <Button variant="outline" size="sm" className="w-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          図面一覧に戻る
        </Button>
      </Link>
      
      <div className="space-y-1">
        <div className="text-md text-gray-600">{blueprint.drawing}</div>
        <h2 className="text-lg font-bold text-gray-900">{blueprint.productName}</h2>
        <div className="text-md text-gray-600">{blueprint.customerName}</div>
      </div>
    </div>
  );

  const sidebarMenus = getSidebarMenus(blueprintId);

  return (
    <div className="min-h-calc(100vh) bg-background">
      <BlueprintSidebar
        sections={sidebarMenus}
        activeTab={currentPage}
        onTabChange={() => {}}
        headerContent={sidebarHeaderContent}
      />
      <div className="ml-64">
        {children}
      </div>
    </div>
  );
}