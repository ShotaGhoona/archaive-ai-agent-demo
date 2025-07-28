import Blueprints from "@/components/feature/blueprint/Container";
import ChatUIManager from "@/components/feature/ai-agent";

export default function Blueprint() {
  return (
    <div className="max-h-calc[100vh-45px] flex flex-col overflow-hidden">
      <Blueprints />
      <ChatUIManager 
        availableAgents={['general', 'estimate', 'inquiry']}
      />
    </div>
  );
}
