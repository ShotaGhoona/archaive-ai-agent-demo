import BlueprintDetail from "@/page-components/blueprint/detail/ui/BlueprintDetailContainer";
import ChatUIManager from "@/features/ai-agent";

export default function BlueprintDetailPage() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <BlueprintDetail  />
      <ChatUIManager 
        availableAgents={['general', 'estimate', 'trouble']}
      />
    </div>
  );
}
