// import { Button } from "@/components/ui";
// import { 
//   Printer, 
//   Download, 
//   Share2,
//   Info
// } from "lucide-react";

// interface ActiveFile {
//   id: string;
//   name: string;
//   imageUrl: string;
//   description?: string;
//   size: number;
// }

// interface DetailToolbarProps {
//   activeTab: string;
//   activeFile?: ActiveFile;
//   onDownload?: () => void;
//   onPrint?: () => void;
//   onShare?: () => void;
// }

// interface ToolAction {
//   id: string;
//   icon: React.ComponentType<{ className?: string }>;
//   label: string;
//   description: string;
//   action: () => void;
// }

// export function DetailToolbar({ 
//   activeTab, 
//   activeFile, 
//   onDownload, 
//   onPrint, 
//   onShare 
// }: DetailToolbarProps) {
  
//   const handleDownload = () => {
//     if (activeFile && onDownload) {
//       onDownload();
//     } else if (activeFile) {
//       // デフォルトのダウンロード処理
//       const link = document.createElement('a');
//       link.href = activeFile.imageUrl;
//       link.download = activeFile.name;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const handlePrint = () => {
//     if (onPrint) {
//       onPrint();
//     } else if (activeFile) {
//       // デフォルトの印刷処理
//       const printWindow = window.open('', '_blank');
//       if (printWindow) {
//         printWindow.document.write(`
//           <html>
//             <head><title>印刷: ${activeFile.name}</title></head>
//             <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;">
//               <img src="${activeFile.imageUrl}" style="max-width:100%;max-height:100%;" />
//             </body>
//           </html>
//         `);
//         printWindow.document.close();
//         printWindow.print();
//       }
//     }
//   };

//   const handleShare = () => {
//     if (onShare) {
//       onShare();
//     } else if (activeFile && navigator.share) {
//       navigator.share({
//         title: activeFile.name,
//         text: activeFile.description,
//         url: activeFile.imageUrl
//       });
//     }
//   };

//   // アクションボタンの定義
//   const actions: ToolAction[] = [
//     {
//       id: 'download',
//       icon: Download,
//       label: 'ダウンロード',
//       description: 'ファイルをダウンロード',
//       action: handleDownload
//     },
//     {
//       id: 'print', 
//       icon: Printer,
//       label: '印刷',
//       description: '図面を印刷',
//       action: handlePrint
//     },
//     {
//       id: 'share',
//       icon: Share2, 
//       label: '共有',
//       description: '図面を共有',
//       action: handleShare
//     }
//   ];

//   // 図面タブ以外では表示しない
//   if (activeTab !== "blueprint") {
//     return null;
//   }

//   // アクティブファイルがない場合は表示しない
//   if (!activeFile) {
//     return (
//       <div className="w-16 border-l bg-white flex flex-col items-center justify-center py-4">
//         <div className="text-center space-y-2">
//           <Info className="h-6 w-6 text-gray-300 mx-auto" />
//           <p className="text-xs text-gray-400 rotate-90 whitespace-nowrap">
//             図面を選択
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-16 border-l bg-white flex flex-col items-center py-4 gap-3">
//       {actions.map((action) => {
//         const Icon = action.icon;
        
//         return (
//           <Button
//             key={action.id}
//             variant="ghost"
//             size="lg"
//             onClick={action.action}
//             className="h-12 w-12 p-0 hover:bg-gray-100 transition-colors"
//             title={`${action.label}: ${action.description}`}
//           >
//             <Icon className="h-5 w-5" />
//           </Button>
//         );
//       })}
      
//       {/* ファイル情報表示 */}
//       <div className="mt-auto pt-4 border-t border-gray-200 mx-2">
//         <div className="text-center space-y-1">
//           <div className="text-xs font-medium text-gray-600 rotate-90 whitespace-nowrap">
//             {activeFile.name.split('.').pop()?.toUpperCase()}
//           </div>
//           <div className="text-xs text-gray-400 rotate-90 whitespace-nowrap">
//             {(activeFile.size / 1024 / 1024).toFixed(1)}MB
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }