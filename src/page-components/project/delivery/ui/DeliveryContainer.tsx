'use client';

import { useState } from 'react';
import { DocumentDetailViewContainer } from '@/shared/view/document-detail-view';

import {
  DocumentDeliveryDataInterface,
  projectDeliveryData,
} from '@/dummy-data-er-fix/document';
import { createDeliveryDetailConfig } from '../lib';

export function DeliveryContainer() {
  const [deliveries] = useState<DocumentDeliveryDataInterface[]>(
    projectDeliveryData as DocumentDeliveryDataInterface[],
  );
  const config = createDeliveryDetailConfig();

  return <DocumentDetailViewContainer data={deliveries} config={config} />;
}
