import { BlueprintHomeContainer } from "@/page-components";
import ChatUIManager from "@/features/ai-agent";

export default function Blueprint() {
  return (
    <div className="max-h-calc[100vh-45px] flex flex-col overflow-hidden">
      <BlueprintHomeContainer />
      <ChatUIManager 
        availableAgents={['general', 'estimate', 'inquiry']}
      />
    </div>
  );
}
