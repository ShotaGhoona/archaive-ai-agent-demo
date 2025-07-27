import ChatUIManager from "@/components/feature/ai-agent";

export default function BlueprintDetailPage() {
  return (
    <div>
      
    <ChatUIManager 
      availableAgents={['general', 'estimate', 'inquiry', 'process']}
      />
    </div>
  );
}