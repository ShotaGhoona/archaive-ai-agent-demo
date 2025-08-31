'use client';

import { useState } from 'react';
import { DocumentDetailViewContainer } from '@/shared/view/document-detail-view';
import {
  DocumentShippingDataInterface,
  projectShippingData,
} from '@/dummy-data-er-fix/document';
import { createShippingDetailConfig } from '../lib/shippingDetailConfig';

export function ShippingContainer() {
  const [shippings] = useState<DocumentShippingDataInterface[]>(
    projectShippingData as DocumentShippingDataInterface[],
  );
  const config = createShippingDetailConfig();

  return <DocumentDetailViewContainer data={shippings} config={config} />;
}
