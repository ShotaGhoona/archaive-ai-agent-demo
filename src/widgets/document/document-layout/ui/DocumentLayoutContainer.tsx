'use client';
import { DocumentLayoutContainerProps } from '../model';
import { DocumentTypeHeader } from './DocumentTypeHeader';

export function DocumentLayoutContainer({ 
  children,
  activeType
}: DocumentLayoutContainerProps) {
  return (
    <div className="h-[calc(100vh-45px)] flex flex-col">
      {/* Document Type Tab Navigation */}
      <div className="flex-shrink-0">
        <DocumentTypeHeader activeType={activeType} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
}