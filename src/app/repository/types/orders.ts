export interface OrderData {
    order_id: string;
    user_id: string;
    total_amount: number;
    status: string;
    items: OrderItemData[];
    shipping_address: AddressData;
    payment_info: PaymentInfoData;
    created_at: string;
    paid_at?: string;
}

export interface OrderItemData {
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

export interface AddressData {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export interface PaymentInfoData {
    payment_method: string;
    payment_intent_id: string;
    last4: string;
    brand: string;
}
