import { ProjectBlueprintContainer } from "@/page-components/project/blueprint/ui/ProjectBlueprintContainer";
import ChatUIManager from "@/features/ai-agent";

export default function BlueprintDetailPage() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ProjectBlueprintContainer  />
      <ChatUIManager 
        availableAgents={['general', 'estimate', 'trouble']}
      />
    </div>
  );
}
