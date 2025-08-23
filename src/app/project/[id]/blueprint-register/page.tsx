import { BlueprintRegisterContainer } from "@/page-components/project/blueprint-register/ui/BlueprintRegisterContainer";
import ChatUIManager from "@/features/ai-agent";

export default function BlueprintRegisterPage() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <BlueprintRegisterContainer />
      <ChatUIManager 
        availableAgents={['general', 'estimate', 'trouble']}
      />
    </div>
  );
}