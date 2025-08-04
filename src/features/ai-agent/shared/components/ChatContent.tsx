// "use client";

// import { useEffect, useRef } from "react";
// import { Message, AIAgentConfig } from "../../types/types";
// import ChatMessage from "./ChatMessage";
// import { MessageSquare } from "lucide-react";

// interface ChatContentProps {
//   messages: Message[];
//   isLoading: boolean;
//   agentConfig: AIAgentConfig;
//   sessionImage?: File | null;
// }

// // 🎯 ウェルカムメッセージ取得
// function getWelcomeMessage(agentId: string): string {
//   switch (agentId) {
//     case 'estimate':
//       return '図面をアップロードして見積もりを依頼できます。+ボタンから図面を添付してください。';
//     case 'general':
//       return '製造業に関するご質問にお答えします。画像の分析も可能です。';
//     default:
//       return 'どのようなことでお手伝いできますか？';
//   }
// }

// export default function ChatContent({ messages, agentConfig }: ChatContentProps) {
//   const scrollRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const displayMessages = messages.filter(msg => 
//     !msg.content.includes('typing') || msg.sender !== 'ai'
//   );

//   return (
//     <div className="flex-1 flex flex-col h-full min-h-0">
//       <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
//         {displayMessages.length === 0 && (
//           <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
//             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
//               <MessageSquare className="w-8 h-8 text-blue-600" />
//             </div>
//             <div className="space-y-2">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 {agentConfig.name}へようこそ
//               </h3>
//               <p className="text-gray-600 max-w-md">
//                 {getWelcomeMessage(agentConfig.id)}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* セッション画像プレビュー */}
//         {/* {sessionImage && (
//           <SessionImagePreview image={sessionImage} />
//         )} */}

//         {displayMessages.map((message) => (
//           <ChatMessage 
//             key={message.id} 
//             message={message} 
//             agentConfig={agentConfig}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }