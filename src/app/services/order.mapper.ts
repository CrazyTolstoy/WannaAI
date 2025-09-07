import { BackendOrder } from './orders.service';
import { Order, LocalOrderStatus } from '../models/order';

function mapStatusFromBE(s?: string): LocalOrderStatus {
  // Map your BE statuses into UI statuses; extend as needed
  switch ((s ?? '').toLowerCase()) {
    case 'novo':      return 'novo';
    case 'u_toku':    return 'u_toku';
    case 'zavrseno':
    case 'sent':      return 'zavrseno';
    case 'otkazano':
    case 'failed':    return 'otkazano';
    default:          return 'novo';
  }
}

export function mapOrderFromBE(o: BackendOrder): Order {
  return {
    id: String(o.id),
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    customerPhone: o.customerPhone,
    createdAt: o.createdAt ?? new Date().toISOString(),
    status: mapStatusFromBE(o.status),
    items: (o.items ?? []).map(i => ({
      sku: i.sku ?? (i.productId != null ? String(i.productId) : ''),
      name: i.name ?? (i.productId != null ? `Proizvod ${i.productId}` : 'Stavka'),
      quantity: i.quantity ?? 0,
      price: i.price ?? 0
    })),
    note: o.note,
    sentToWoo: !!o.woocommerceOrderId
  };
}
