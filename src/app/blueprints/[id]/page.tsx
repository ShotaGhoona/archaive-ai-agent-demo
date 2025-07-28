import BlueprintDetail from "@/components/feature/blueprint-detail/Container";
import ChatUIManager from "@/components/feature/ai-agent";

export default function BlueprintDetailPage() {
  return (
    <div className="max-h-calc[100vh-45px] flex flex-col overflow-hidden">
      <BlueprintDetail  />
      <ChatUIManager 
        availableAgents={['general', 'estimate', 'inquiry']}
      />
    </div>
  );
}
