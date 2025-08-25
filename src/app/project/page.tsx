import { ProjectContainer } from "@/page-components";
import ChatUIManager from "@/features/ai-agent";

export default function Project() {
  return (
    <div className="max-h-calc[100vh-45px] flex flex-col overflow-hidden">
      <ProjectContainer />
      <ChatUIManager 
        availableAgents={['general', 'estimate', 'trouble']}
      />
    </div>
  );
}
