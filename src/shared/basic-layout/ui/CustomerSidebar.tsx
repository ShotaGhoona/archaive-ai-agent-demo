"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { customerMenuItems } from "../constants/customer";
import { ArrowLeft } from "lucide-react";

interface CustomerSidebarProps {
  customerId: string;
  className?: string;
}

export function CustomerSidebar({ customerId, className }: CustomerSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`w-48 bg-background shadow-lg p-6 ${className || ''}`}>
      {/* 戻るボタン */}
      <div className="mb-8">
        <Link
          href="/customer"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          顧客一覧に戻る
        </Link>
      </div>

      {/* メニュー */}
      <nav>
        {customerMenuItems.map((item) => {
          const href = item.href.replace("[id]", customerId);
          const isActive = pathname === href;

          return (
            <Link
              key={item.id}
              href={href}
              className={`flex items-center py-3 text-sm transition-colors ${
                isActive
                  ? "text-primary font-medium"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}