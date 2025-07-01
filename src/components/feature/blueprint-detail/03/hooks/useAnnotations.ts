"use client";

import { useState, useCallback } from "react";
import { AnnotationPoint, SpatialContext } from "../types";

// ダミー空間文脈生成
const generateSpatialContext = (x: number, y: number): SpatialContext => {
  const contexts = [
    {
      nearbyElements: ["エンジンブラケット", "ボルト穴"],
      dimensions: { width: 50, height: 30 },
      materials: ["SS400"],
      description: "エンジン取付部の詳細",
      importance: 'critical' as const
    },
    {
      nearbyElements: ["フランジ部", "寸法線"],
      dimensions: { width: 25, height: 15 },
      materials: ["SUS304"],
      description: "フランジ接続部",
      importance: 'normal' as const
    },
    {
      nearbyElements: ["角部", "R加工"],
      description: "コーナー加工部分",
      importance: 'minor' as const
    }
  ];
  
  return {
    ...contexts[Math.floor(Math.random() * contexts.length)],
    relatedAnnotations: []
  };
};

export const useAnnotations = () => {
  const [annotations, setAnnotations] = useState<AnnotationPoint[]>([]);

  const createAnnotation = useCallback((screenPosition: { x: number; y: number }, relativePosition: { x: number; y: number }) => {
    const newAnnotation: AnnotationPoint = {
      id: `annotation-${Date.now()}`,
      position: relativePosition,
      screenPosition,
      context: generateSpatialContext(relativePosition.x, relativePosition.y),
      conversations: [],
      status: 'active',
      createdAt: new Date(),
      lastActiveAt: new Date()
    };

    setAnnotations(prev => [...prev, newAnnotation]);
    return newAnnotation;
  }, []);

  const updateAnnotation = useCallback((id: string, updates: Partial<AnnotationPoint>) => {
    setAnnotations(prev => prev.map(annotation => 
      annotation.id === id 
        ? { ...annotation, ...updates, lastActiveAt: new Date() }
        : annotation
    ));
  }, []);

  const deleteAnnotation = useCallback((id: string) => {
    setAnnotations(prev => prev.filter(annotation => annotation.id !== id));
  }, []);

  const getAnnotation = useCallback((id: string) => {
    return annotations.find(annotation => annotation.id === id);
  }, [annotations]);

  return {
    annotations,
    createAnnotation,
    updateAnnotation,
    deleteAnnotation,
    getAnnotation
  };
};