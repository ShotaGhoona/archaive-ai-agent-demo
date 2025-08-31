'use client';

import { useState } from 'react';
import { DocumentDetailViewContainer } from '@/shared/view/document-detail-view';
import {
  DocumentSpecificationDataInterface,
  blueprintSpecificationData,
} from '@/dummy-data-er-fix/document';
import { createSpecificationDetailConfig } from '../lib';

export function SpecificationContainer() {
  const [specifications] = useState<DocumentSpecificationDataInterface[]>(
    blueprintSpecificationData as DocumentSpecificationDataInterface[],
  );
  const config = createSpecificationDetailConfig();

  return <DocumentDetailViewContainer data={specifications} config={config} />;
}
