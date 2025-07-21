// TODO: チャット履歴の実装

// "use client";
// import React, { useState, useEffect } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { 
//   MessageCircle, 
//   Clock, 
//   Star,
//   MoreHorizontal,
//   Trash2,
//   Edit,
//   Pin
// } from 'lucide-react';
// import { cn } from '@/lib/utils';

// interface ChatSession {
//   id: string;
//   title: string;
//   lastMessage: string;
//   timestamp: Date;
//   agentType: string;
//   messageCount: number;
//   isPinned: boolean;
//   tags: string[];
// }

// interface ChatHistoryProps {
//   agentType?: string;
//   onSessionSelect?: (sessionId: string) => void;
//   selectedSessionId?: string;
// }

// const ChatHistory: React.FC<ChatHistoryProps> = ({
//   agentType,
//   onSessionSelect,
//   selectedSessionId
// }) => {
//   const [sessions, setSessions] = useState<ChatSession[]>([]);
//   const [filter, setFilter] = useState<string>('all');

//   // サンプルデータ（実際の実装では localStorage や API から取得）
//   useEffect(() => {
//     const sampleSessions: ChatSession[] = [
//       {
//         id: 'session-1',
//         title: '図面A-001の見積もり相談',
//         lastMessage: '材料費を含めた詳細な見積もりをお送りします。',
//         timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30分前
//         agentType: 'estimate',
//         messageCount: 12,
//         isPinned: true,
//         tags: ['見積もり', '急ぎ']
//       },
//       {
//         id: 'session-2',
//         title: '製造工程の最適化について',
//         lastMessage: '並行作業により20%の時間短縮が可能です。',
//         timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2時間前
//         agentType: 'process',
//         messageCount: 8,
//         isPinned: false,
//         tags: ['工程', '最適化']
//       },
//       {
//         id: 'session-3',
//         title: 'ステンレス材料について',
//         lastMessage: 'SUS304とSUS316の価格差についてご説明します。',
//         timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1日前
//         agentType: 'inquiry',
//         messageCount: 5,
//         isPinned: false,
//         tags: ['材料', 'ステンレス']
//       },
//       {
//         id: 'session-4',
//         title: '一般的な相談',
//         lastMessage: '図面の寸法について詳しく教えてください。',
//         timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2日前
//         agentType: 'general',
//         messageCount: 15,
//         isPinned: false,
//         tags: ['相談']
//       }
//     ];
//     setSessions(sampleSessions);
//   }, []);

//   const formatRelativeTime = (timestamp: Date) => {
//     const now = new Date();
//     const diff = now.getTime() - timestamp.getTime();
    
//     const minutes = Math.floor(diff / (1000 * 60));
//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
//     if (minutes < 60) {
//       return `${minutes}分前`;
//     } else if (hours < 24) {
//       return `${hours}時間前`;
//     } else {
//       return `${days}日前`;
//     }
//   };

//   const getAgentColor = (agentType: string) => {
//     switch (agentType) {
//       case 'general':
//         return 'bg-blue-100 text-blue-800';
//       case 'estimate':
//         return 'bg-green-100 text-green-800';
//       case 'process':
//         return 'bg-orange-100 text-orange-800';
//       case 'inquiry':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getAgentName = (agentType: string) => {
//     switch (agentType) {
//       case 'general':
//         return 'なんでもAI';
//       case 'estimate':
//         return '見積もりAI';
//       case 'process':
//         return '工程生成AI';
//       case 'inquiry':
//         return '問い合わせAI';
//       default:
//         return 'AI';
//     }
//   };

//   const filteredSessions = sessions.filter(session => {
//     if (filter === 'all') return true;
//     if (filter === 'pinned') return session.isPinned;
//     if (filter === 'recent') return (new Date().getTime() - session.timestamp.getTime()) < (1000 * 60 * 60 * 24); // 24時間以内
//     return session.agentType === filter;
//   });

//   const pinnedSessions = filteredSessions.filter(s => s.isPinned);
//   const regularSessions = filteredSessions.filter(s => !s.isPinned);

//   const handleSessionClick = (sessionId: string) => {
//     onSessionSelect?.(sessionId);
//   };

//   const togglePin = (sessionId: string) => {
//     setSessions(prev => prev.map(session => 
//       session.id === sessionId 
//         ? { ...session, isPinned: !session.isPinned }
//         : session
//     ));
//   };

//   return (
//     <div className="h-full flex flex-col">
//       {/* ヘッダー */}
//       <div className="p-4 border-b border-border">
//         <h2 className="font-semibold text-lg mb-3">チャット履歴</h2>
        
//         {/* フィルター */}
//         <div className="flex flex-wrap gap-1">
//           {[
//             { id: 'all', label: 'すべて' },
//             { id: 'pinned', label: 'ピン留め' },
//             { id: 'recent', label: '最近' },
//             { id: 'general', label: 'なんでも' },
//             { id: 'estimate', label: '見積もり' },
//             { id: 'process', label: '工程' },
//             { id: 'inquiry', label: '問い合わせ' }
//           ].map((filterOption) => (
//             <Button
//               key={filterOption.id}
//               variant={filter === filterOption.id ? "default" : "outline"}
//               size="sm"
//               className="h-6 text-xs"
//               onClick={() => setFilter(filterOption.id)}
//             >
//               {filterOption.label}
//             </Button>
//           ))}
//         </div>
//       </div>

//       {/* セッション一覧 */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-3">
//         {/* ピン留めセッション */}
//         {pinnedSessions.length > 0 && (
//           <div className="space-y-2">
//             <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
//               <Pin className="w-3 h-3" />
//               ピン留め
//             </div>
//             {pinnedSessions.map((session) => (
//               <SessionCard
//                 key={session.id}
//                 session={session}
//                 isSelected={selectedSessionId === session.id}
//                 onSelect={handleSessionClick}
//                 onTogglePin={togglePin}
//                 getAgentColor={getAgentColor}
//                 getAgentName={getAgentName}
//                 formatRelativeTime={formatRelativeTime}
//               />
//             ))}
//           </div>
//         )}

//         {/* 通常のセッション */}
//         {regularSessions.length > 0 && (
//           <div className="space-y-2">
//             {pinnedSessions.length > 0 && (
//               <div className="text-xs font-medium text-muted-foreground">
//                 最近のチャット
//               </div>
//             )}
//             {regularSessions.map((session) => (
//               <SessionCard
//                 key={session.id}
//                 session={session}
//                 isSelected={selectedSessionId === session.id}
//                 onSelect={handleSessionClick}
//                 onTogglePin={togglePin}
//                 getAgentColor={getAgentColor}
//                 getAgentName={getAgentName}
//                 formatRelativeTime={formatRelativeTime}
//               />
//             ))}
//           </div>
//         )}

//         {filteredSessions.length === 0 && (
//           <div className="text-center py-8 text-muted-foreground">
//             <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
//             <p className="text-sm">チャット履歴がありません</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// interface SessionCardProps {
//   session: ChatSession;
//   isSelected: boolean;
//   onSelect: (sessionId: string) => void;
//   onTogglePin: (sessionId: string) => void;
//   getAgentColor: (agentType: string) => string;
//   getAgentName: (agentType: string) => string;
//   formatRelativeTime: (timestamp: Date) => string;
// }

// const SessionCard: React.FC<SessionCardProps> = ({
//   session,
//   isSelected,
//   onSelect,
//   onTogglePin,
//   getAgentColor,
//   getAgentName,
//   formatRelativeTime
// }) => {
//   const [showMenu, setShowMenu] = useState(false);

//   return (
//     <Card 
//       className={cn(
//         "cursor-pointer transition-all hover:shadow-md",
//         isSelected && "border-primary bg-primary/5"
//       )}
//       onClick={() => onSelect(session.id)}
//     >
//       <CardContent className="p-3">
//         <div className="flex items-start justify-between mb-2">
//           <div className="flex items-center gap-2 flex-1 min-w-0">
//             {session.isPinned && <Pin className="w-3 h-3 text-yellow-500 shrink-0" />}
//             <span className="font-medium text-sm truncate">{session.title}</span>
//           </div>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
//             onClick={(e) => {
//               e.stopPropagation();
//               setShowMenu(!showMenu);
//             }}
//           >
//             <MoreHorizontal className="w-3 h-3" />
//           </Button>
//         </div>
        
//         <div className="flex items-center gap-2 mb-2">
//           <Badge className={`text-xs ${getAgentColor(session.agentType)}`}>
//             {getAgentName(session.agentType)}
//           </Badge>
//           <span className="text-xs text-muted-foreground">
//             {session.messageCount}件
//           </span>
//         </div>
        
//         <div className="text-xs text-muted-foreground mb-2 line-clamp-2">
//           {session.lastMessage}
//         </div>
        
//         <div className="flex items-center justify-between">
//           <div className="flex gap-1">
//             {session.tags.map((tag, index) => (
//               <Badge key={index} variant="outline" className="text-xs">
//                 {tag}
//               </Badge>
//             ))}
//           </div>
//           <div className="flex items-center gap-1 text-xs text-muted-foreground">
//             <Clock className="w-3 h-3" />
//             {formatRelativeTime(session.timestamp)}
//           </div>
//         </div>

//         {/* コンテキストメニュー */}
//         {showMenu && (
//           <div className="absolute right-2 top-8 bg-background border rounded-md shadow-lg z-10">
//             <Button
//               variant="ghost"
//               size="sm"
//               className="w-full justify-start h-8"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onTogglePin(session.id);
//                 setShowMenu(false);
//               }}
//             >
//               <Pin className="w-3 h-3 mr-2" />
//               {session.isPinned ? 'ピン解除' : 'ピン留め'}
//             </Button>
//             <Button
//               variant="ghost"
//               size="sm"
//               className="w-full justify-start h-8"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setShowMenu(false);
//               }}
//             >
//               <Edit className="w-3 h-3 mr-2" />
//               編集
//             </Button>
//             <Button
//               variant="ghost"
//               size="sm"
//               className="w-full justify-start h-8 text-red-600"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setShowMenu(false);
//               }}
//             >
//               <Trash2 className="w-3 h-3 mr-2" />
//               削除
//             </Button>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default ChatHistory;