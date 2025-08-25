import quotationDataJson from './quotation.json';
import orderDataJson from './order.json';
import deliveryDataJson from './delivery.json';
import invoiceDataJson from './invoice.json';
import specificationDataJson from './specification.json';
import inspectionDataJson from './inspection.json';

import type { Quotation, Order, Delivery, Invoice, Specification, Inspection } from '../model';

export const quotationData = quotationDataJson as Quotation[];
export const orderData = orderDataJson as Order[];
export const deliveryData = deliveryDataJson as Delivery[];
export const invoiceData = invoiceDataJson as Invoice[];
export const specificationData = specificationDataJson as Specification[];
export const inspectionData = inspectionDataJson as Inspection[];