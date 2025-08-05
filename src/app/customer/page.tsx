import CustomerContainer from "@/page-components/customer/ui/CustomerContainer";
import ChatUIManager from "@/features/ai-agent";

export default function Customer() {
  return (
    <div className="max-h-calc[100vh-45px] flex flex-col overflow-hidden">
      <CustomerContainer />
      <ChatUIManager 
        availableAgents={['general', 'estimate', 'inquiry']}
      />
    </div>
  );
}
