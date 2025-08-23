import { BasicInfoContainer } from "@/page-components/project/basic-information/ui/BasicInfoContainer";
import ChatUIManager from "@/features/ai-agent";

export default function BlueprintDetailPage() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <BasicInfoContainer  />
      <ChatUIManager 
        availableAgents={['general', 'estimate', 'trouble']}
      />
    </div>
  );
}
