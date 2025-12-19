import { Injectable } from '@angular/core';
import { Order, OrderItem, Address, PaymentInfo, OrderStatus } from '../../models/order';
import { OrderData, OrderItemData, AddressData, PaymentInfoData } from '../../repository/types/orders';

@Injectable({
    providedIn: 'root',
})
export class OrdersAdapter {
    static adapt(data: OrderData): Order {
        return {
            orderId: data.order_id,
            userId: data.user_id,
            totalAmount: data.total_amount,
            status: data.order_status as OrderStatus,
            items: data.items.map((item) => OrdersAdapter.adaptOrderItem(item)),
            shippingAddress: OrdersAdapter.adaptAddress(data.shipping_address),
            paymentInfo: OrdersAdapter.adaptPaymentInfo(data.payment_info),
            createdAt: data.created_at,
            paidAt: data.paid_at,
        };
    }

    static adaptMany(dataArray: OrderData[]): Order[] {
        return dataArray.map((data) => OrdersAdapter.adapt(data));
    }

    private static adaptOrderItem(data: OrderItemData): OrderItem {
        return {
            productId: data.product_id,
            productName: data.product_name,
            quantity: data.quantity,
            unitPrice: data.unit_price,
            subtotal: data.subtotal,
        };
    }

    private static adaptAddress(data: AddressData): Address {
        return {
            name: data.name,
            street: data.street,
            city: data.city,
            state: data.state,
            zip: data.zip,
            country: data.country,
        };
    }

    private static adaptPaymentInfo(data: PaymentInfoData): PaymentInfo {
        return {
            paymentMethod: data.payment_method,
            paymentIntentId: data.payment_intent_id,
            last4: data.last4,
            brand: data.brand,
        };
    }
}
