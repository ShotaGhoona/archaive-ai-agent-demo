import { 
  FileText, Package, Wrench, Calculator, Truck, ClipboardCheck, 
  FolderOpen, Receipt, ShoppingCart, Send, BookOpen, Tag,
  Building2, ShoppingBag, Box
} from "lucide-react";
import { FaFolder } from "react-icons/fa";
import { V2SidebarItem } from "../model/types";

export const getIconByType = (type: V2SidebarItem['type']): React.ReactNode => {
  switch (type) {
    case 'project-folder':
      return <FolderOpen className="w-4 h-4" />;
    case 'folder':
      return <FaFolder className="w-4 h-4" />;
    case 'blueprint':
      return <FileText className="w-4 h-4" />;
    case 'project-info':
      return <Package className="w-4 h-4" />;
    case 'quotation':
      return <Calculator className="w-4 h-4" />;
    case 'order':
      return <ShoppingCart className="w-4 h-4" />;
    case 'delivery-note':
      return <Receipt className="w-4 h-4" />;
    case 'inspection-report':
      return <ClipboardCheck className="w-4 h-4" />;
    case 'specification':
      return <BookOpen className="w-4 h-4" />;
    case 'shipping-label':
      return <Send className="w-4 h-4" />;
    case 'outsource-quotation':
      return <Building2 className="w-4 h-4" />;
    case 'outsource-order':
      return <ShoppingBag className="w-4 h-4" />;
    case 'outsource-delivery':
      return <Box className="w-4 h-4" />;
    case '3d-model':
      return <Package className="w-4 h-4" />;
    case 'custom':
      return <Wrench className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};