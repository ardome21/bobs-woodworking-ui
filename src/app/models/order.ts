export interface Order {
    orderId: string;
    userId: string;
    totalAmount: number;
    status: OrderStatus;
    items: OrderItem[];
    shippingAddress: Address;
    paymentInfo: PaymentInfo;
    createdAt: string;
    paidAt?: string;
}

export enum OrderStatus {
    PENDING = 'pending',
    PAID = 'paid',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface Address {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export interface PaymentInfo {
    paymentMethod: string;
    paymentIntentId: string;
    last4: string;
    brand: string;
}

export interface CreateOrderRequest {
    items: {
        product_id: number;
        quantity: number;
    }[];
    shipping_address: {
        name: string;
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    payment_intent_id: string;
}

export interface CreateOrderResponse {
    order_id: string;
    total_amount: number;
    status: string;
    message: string;
}

export interface PaymentIntent {
    clientSecret: string;
    paymentIntentId: string;
}
