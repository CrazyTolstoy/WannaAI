import { BackendOrder } from './orders.service';
import { Order, LocalOrderStatus } from '../models/order';

function mapStatusFromBE(s?: string): LocalOrderStatus {
  switch ((s ?? '').toLowerCase()) {
    case 'novo': return 'novo';
    case 'u_toku': return 'u_toku';
    case 'zavrseno':
    case 'sent': return 'zavrseno';
    case 'otkazano':
    case 'failed': return 'otkazano';
    default: return 'novo';
  }
}

function fmt(parts: Array<string | null | undefined>): string {
  return parts.filter(p => !!p && String(p).trim().length > 0).join(', ');
}

/** Returns ONLY the shipping address as a single formatted line. */
function formatShippingAddress(o: BackendOrder): string | undefined {
  const addrs = o.addresses ?? [];
  // prefer type==="shipping"; fallback to first address if none labeled
  const ship = addrs.find(a => (a.type ?? '').toLowerCase() === 'shipping') ?? addrs[0];
  if (!ship) return undefined;

  const name = fmt([ship.firstName, ship.lastName]) || undefined;
  return fmt([ ship.company, ship.address1, ship.address2, ship.city, ship.state, ship.postcode, ship.country]);
}

function toJsDate(input?: string): Date {
  if (!input) return new Date(NaN);
  let s = input;

  // Trim microseconds to milliseconds (keep only first 3 digits after the dot)
  s = s.replace(/(\.\d{3})\d+$/, '$1');

  // If no timezone provided, assume UTC by appending 'Z'
  if (!/[zZ]|[+\-]\d{2}:\d{2}$/.test(s)) s += 'Z';

  return new Date(s);
}

export function mapOrderFromBE(o: BackendOrder): Order {
  return {
    id: String(o.id),
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    customerPhone: o.customerPhone,
    createdAt: toJsDate(o.createdAt),
    status: mapStatusFromBE(o.status),
    items: (o.items ?? []).map(i => ({
      sku: i.sku ?? (i.productId != null ? String(i.productId) : ''),
      name: i.name ?? (i.productId != null ? `Proizvod ${i.productId}` : 'Stavka'),
      quantity: i.quantity ?? 0,
      price: i.price ?? 0
    })),
    note: o.note,
    sentToWoo: !!o.woocommerceOrderId,
    // put ONLY shipping address into your existing `addresses` field
    addresses: formatShippingAddress(o),
  };
}
