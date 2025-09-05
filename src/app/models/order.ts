export interface OrderItem {
sku: string;
name: string;
quantity: number;
price: number; // per unit
}


export type LocalOrderStatus = 'novo' | 'u_toku' | 'zavrseno' | 'otkazano';


export interface Order {
id: string; // internal ID
customerName: string;
customerEmail?: string;
customerPhone?: string;
createdAt: string; // ISO string
status: LocalOrderStatus;
items: OrderItem[];
note?: string;
// UI/Sync flags
sentToWoo?: boolean;
}