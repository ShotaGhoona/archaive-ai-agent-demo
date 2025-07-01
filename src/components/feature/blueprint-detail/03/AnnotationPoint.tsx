"use client";

import { useState, useEffect } from "react";
import { AnnotationPoint as AnnotationPointType } from "./types";
import { MessageCircle, Check, Clock } from "lucide-react";

interface AnnotationPointProps {
  annotation: AnnotationPointType;
  onClick: () => void;
  isActive?: boolean;
}

export default function AnnotationPoint({ annotation, onClick, isActive = false }: AnnotationPointProps) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (annotation.status === 'active') {
      const interval = setInterval(() => {
        setPulse(true);
        setTimeout(() => setPulse(false), 1000);
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [annotation.status]);

  const getStatusIcon = () => {
    switch (annotation.status) {
      case 'resolved': return <Check className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      default: return <MessageCircle className="w-3 h-3" />;
    }
  };

  const getStatusColor = () => {
    switch (annotation.status) {
      case 'resolved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-primary';
    }
  };

  const getImportanceSize = () => {
    switch (annotation.context.importance) {
      case 'critical': return 'w-8 h-8';
      case 'normal': return 'w-6 h-6';
      case 'minor': return 'w-5 h-5';
    }
  };

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
      style={{
        left: annotation.screenPosition.x,
        top: annotation.screenPosition.y,
      }}
      onClick={onClick}
    >
      {/* パルスアニメーション */}
      {pulse && (
        <div
          className={`
            absolute inset-0 rounded-full ${getStatusColor()} 
            animate-ping opacity-75
            ${getImportanceSize()}
          `}
        />
      )}
      
      {/* メインポイント */}
      <div
        className={`
          ${getImportanceSize()} ${getStatusColor()} rounded-full
          flex items-center justify-center text-white shadow-lg
          transition-all duration-300
          ${isActive ? 'ring-4 ring-white ring-opacity-50 scale-110' : ''}
          hover:scale-125 hover:shadow-xl
        `}
      >
        {getStatusIcon()}
      </div>

      {/* ホバー時のツールチップ */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-background border border-border rounded-lg shadow-lg p-3 whitespace-nowrap">
          <p className="text-sm font-medium">{annotation.context.description}</p>
          <p className="text-xs text-muted-foreground">
            {annotation.conversations.length} メッセージ
          </p>
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-background"></div>
      </div>

      {/* 会話数インジケーター */}
      {annotation.conversations.length > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {annotation.conversations.length}
        </div>
      )}
    </div>
  );
}