'use client';

import { useState } from 'react';
import { DocumentDetailViewContainer } from '@/shared/view/document-detail-view';
import {
  DocumentOrderDataInterface,
  projectOrderData,
} from '@/dummy-data-er-fix/document';
import { createOrderDetailConfig } from '../lib/orderDetailConfig';

export function OrderContainer() {
  const [orders] = useState<DocumentOrderDataInterface[]>(
    projectOrderData as DocumentOrderDataInterface[],
  );
  const config = createOrderDetailConfig();

  return <DocumentDetailViewContainer data={orders} config={config} />;
}
