import BlueprintContainer from "@/page-components/project/blueprint/ui/BlueprintContainer";
import ChatUIManager from "@/features/ai-agent";

export default function BlueprintDetailPage() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <BlueprintContainer  />
      <ChatUIManager 
        availableAgents={['general', 'estimate', 'trouble']}
      />
    </div>
  );
}
