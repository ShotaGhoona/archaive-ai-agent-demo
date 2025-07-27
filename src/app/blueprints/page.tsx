import Blueprints from "@/components/feature/blueprint/Container";
import ChatUIManager from "@/components/feature/ai-agent";

export default function Blueprint() {
  return (
    <div>
      <Blueprints />
      <ChatUIManager 
        availableAgents={['general', 'estimate', 'inquiry']}
      />
    </div>
  );
}
