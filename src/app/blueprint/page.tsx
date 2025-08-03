import BlueprintContainer from "@/page-components/blueprint/ui/BlueprintContainer";
import ChatUIManager from "@/features/ai-agent";

export default function Blueprint() {
  return (
    <div className="max-h-calc[100vh-45px] flex flex-col overflow-hidden">
      <BlueprintContainer />
      <ChatUIManager 
        availableAgents={['general', 'estimate', 'inquiry']}
      />
    </div>
  );
}
