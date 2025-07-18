import ChatUIManager from "@/components/feature/ai-agent";

export default function BlueprintDetailPage() {
  return (
    <ChatUIManager 
      availableAgents={['general', 'estimate', 'inquiry', 'process']}
    />
  );
}