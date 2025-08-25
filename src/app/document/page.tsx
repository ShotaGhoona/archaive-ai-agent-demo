import { DocumentHomeContainer } from "@/page-components/document/home/ui/DocumentHomeContainer";
import ChatUIManager from "@/features/ai-agent";

export default function Document() {
  return (
    <div className="max-h-calc[100vh-45px] flex flex-col overflow-hidden">
      <DocumentHomeContainer />
      <ChatUIManager 
        availableAgents={['general', 'estimate', 'inquiry']}
      />
    </div>
  );
}