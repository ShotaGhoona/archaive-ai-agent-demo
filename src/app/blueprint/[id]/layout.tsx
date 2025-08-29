"use client";
import { useState } from "react";
import { BlueprintTabNavigation } from "@/shared";
import { 
  QuickAccessControls, 
  RevisionBlueprintBar, 
  SameProjectBlueprintBar, 
  RevisionBlueprintCompareModal,
  revisionBlueprintsData,
  sameProjectBlueprintsData,
  RevisionBlueprint
} from "@/widgets/blueprint/quick-access-navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [showSameProjectBlueprints, setShowSameProjectBlueprints] = useState(false);
  const [showRevisionBlueprints, setShowRevisionBlueprints] = useState(false);
  const [compareRevision, setCompareRevision] = useState<RevisionBlueprint | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const handleToggleSameProject = () => {
    setShowSameProjectBlueprints(prev => !prev);
    // 他のバーを閉じる
    if (showRevisionBlueprints) {
      setShowRevisionBlueprints(false);
    }
  };

  const handleToggleRevision = () => {
    setShowRevisionBlueprints(prev => !prev);
    // 他のバーを閉じる
    if (showSameProjectBlueprints) {
      setShowSameProjectBlueprints(false);
    }
  };

  const handleRevisionCompare = (blueprint: RevisionBlueprint) => {
    setCompareRevision(blueprint);
    setIsCompareModalOpen(true);
  };

  const handleCloseCompare = () => {
    setIsCompareModalOpen(false);
    setCompareRevision(null);
  };

  return (
    <div className="h-[calc(100vh-45px)] flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <BlueprintTabNavigation />
          <QuickAccessControls
            showSameProject={showSameProjectBlueprints}
            showRevision={showRevisionBlueprints}
            onToggleSameProject={handleToggleSameProject}
            onToggleRevision={handleToggleRevision}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden h-full relative">
        <div className="h-full">
          {children}
        </div>
        
        {/* Quick Access Overlays */}
        {showSameProjectBlueprints && (
          <SameProjectBlueprintBar
            sameProjectBlueprints={sameProjectBlueprintsData.sameProjectBlueprints}
            projectId="proj-001"
          />
        )}
        
        {showRevisionBlueprints && (
          <RevisionBlueprintBar
            revisionBlueprints={revisionBlueprintsData.revisionBlueprints}
            onCompare={handleRevisionCompare}
          />
        )}
        
        {/* Comparison Modal */}
        <RevisionBlueprintCompareModal
          isOpen={isCompareModalOpen}
          onClose={handleCloseCompare}
          revisionBlueprint={compareRevision}
        />
      </div>
    </div>
  );
}