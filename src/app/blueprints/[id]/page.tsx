import BlueprintDetail from "@/page-components/blueprint-detail/Container";
import ChatUIManager from "@/feature/ai-agent";

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
