export interface OrderItem {
sku: string;
name: string;
quantity: number;
price: number; 
}


export type LocalOrderStatus = 'novo' | 'u_toku' | 'zavrseno' | 'otkazano';


export interface Order {
id: string; // internal ID
customerName: string;
customerEmail?: string;
customerPhone?: string;
addresses?:string;
createdAt: Date; // ISO string
status: LocalOrderStatus;
items: OrderItem[];
note?: string;
// UI/Sync flags
sentToWoo?: boolean;
}