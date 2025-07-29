import ProjectContainer from "@/page-components/project/ui/ProjectContainer";
import ChatUIManager from "@/feature/ai-agent";

export default function Project() {
  return (
    <div className="max-h-calc[100vh-45px] flex flex-col overflow-hidden">
      <ProjectContainer />
      <ChatUIManager 
        availableAgents={['general', 'estimate', 'inquiry']}
      />
    </div>
  );
}
