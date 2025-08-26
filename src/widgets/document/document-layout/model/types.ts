export type DocumentType = 'quotation' | 'order' | 'delivery' | 'invoice' | 'specification' | 'inspection';

export interface DocumentLayoutContainerProps {
  children: React.ReactNode;
  activeType: DocumentType;
}