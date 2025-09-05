import { Order } from '../models/order';


export function mapLocalOrderToWoo(order: Order) {
return {
payment_method: 'bacs',
payment_method_title: 'Bank Transfer',
set_paid: false,
billing: {
first_name: order.customerName,
last_name: '',
email: order.customerEmail ?? '',
phone: order.customerPhone ?? ''
},
shipping: {
first_name: order.customerName,
last_name: ''
},
line_items: order.items.map(i => ({
sku: i.sku,
name: i.name,
quantity: i.quantity,
price: i.price
})),
customer_note: order.note ?? ''
};
}