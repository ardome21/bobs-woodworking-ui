import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { Subscription } from 'rxjs';
import { CartService } from '../../../services/cart';
import { PaymentService } from '../../../services/payment';
import { OrdersService } from '../../../services/orders';
import { CartItem } from '../../../models/cart';
import { CheckoutForm } from '../../presenters/checkout-form/checkout-form';
import { OrderSummary } from '../../presenters/order-summary/order-summary';

@Component({
    selector: 'app-checkout',
    imports: [
        CheckoutForm,
        OrderSummary,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        RouterModule,
    ],
    templateUrl: './checkout.html',
    styleUrls: ['./checkout.scss'],
})
export class Checkout implements OnInit, OnDestroy {
    cartItems: CartItem[] = [];
    subtotal: number = 0;
    total: number = 0;
    isProcessing: boolean = false;

    stripeElements: StripeElements | null = null;
    shippingForm!: FormGroup;
    cardElement!: StripeCardElement;
    isFormReady: boolean = false;

    private cartSubscription?: Subscription;

    private cartService = inject(CartService);
    private paymentService = inject(PaymentService);
    private ordersService = inject(OrdersService);
    private snackBar = inject(MatSnackBar);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    async ngOnInit(): Promise<void> {
        console.log('Checkout ngOnInit called');

        this.cartSubscription = this.cartService.cart$.subscribe(items => {
            this.cartItems = items;
            this.calculateTotals();
        });

        // Reset and reload Stripe to ensure fresh state on each visit
        this.paymentService.resetStripe();

        try {
            const stripe = await this.paymentService.getStripeInstance();
            if (stripe) {
                this.stripeElements = stripe.elements();
                console.log('Stripe loaded successfully, stripeElements:', this.stripeElements);
                // Manually trigger change detection to update the template
                this.cdr.detectChanges();
            } else {
                console.error('Failed to load Stripe');
                this.snackBar.open('Payment system failed to load. Please refresh the page.', 'Close', {
                    duration: 5000
                });
            }
        } catch (error) {
            console.error('Error loading Stripe:', error);
            this.snackBar.open('Payment system failed to load. Please refresh the page.', 'Close', {
                duration: 5000
            });
        }
    }

    onFormReady(event: { form: FormGroup; cardElement: StripeCardElement }): void {
        this.shippingForm = event.form;
        this.cardElement = event.cardElement;

        // Defer state change to avoid ExpressionChangedAfterItHasBeenCheckedError
        // This happens because the child component (CheckoutForm) emits formReady
        // during ngAfterViewInit, which is after the parent has already been checked
        setTimeout(() => {
            this.isFormReady = true;
            this.cdr.detectChanges();
        }, 0);
    }

    async placeOrder(): Promise<void> {
        if (!this.shippingForm.valid) {
            this.shippingForm.markAllAsTouched();
            this.snackBar.open('Please fill in all required fields', 'Close', {
                duration: 3000,
            });
            return;
        }

        if (this.cartItems.length === 0) {
            this.snackBar.open('Your cart is empty', 'Close', { duration: 3000 });
            return;
        }

        this.isProcessing = true;

        try {
            console.log('Creating payment intent for amount:', this.total);
            const paymentIntent = await this.paymentService
                .createPaymentIntent(this.total)
                .toPromise();

            console.log('Payment intent response:', paymentIntent);

            if (!paymentIntent || !paymentIntent.clientSecret) {
                throw new Error('Failed to create payment intent - no client secret received');
            }

            console.log('Confirming card payment with client secret');
            const confirmedPayment = await this.paymentService.confirmCardPayment(
                paymentIntent.clientSecret,
                this.cardElement
            );

            console.log('Payment confirmed:', confirmedPayment);

            console.log('Creating order in backend...');
            const order = await this.ordersService
                .createOrder(
                    this.cartItems,
                    this.shippingForm.value,
                    confirmedPayment.id
                )
                .toPromise();

            console.log('Order created:', order);

            if (!order) {
                throw new Error('Failed to create order');
            }

            console.log('Clearing cart...');
            this.cartService.clearCart();

            this.snackBar.open(
                `Order placed successfully! Order ID: ${order.orderId}`,
                'Close',
                {
                    duration: 5000,
                    panelClass: 'snackbar-success',
                }
            );

            console.log('Navigating to order confirmation...');
            this.router.navigate(['/order-confirmation', order.orderId]);
        } catch (error: any) {
            console.error('Order placement error:', error);
            this.snackBar.open(
                `Payment failed: ${error.message || 'Unknown error'}`,
                'Close',
                {
                    duration: 0,  // Keep error visible until user closes it
                    panelClass: 'snackbar-error'
                }
            );
        } finally {
            this.isProcessing = false;
        }
    }

    private calculateTotals(): void {
        const cart = this.cartService.getCartWithTotals();
        this.subtotal = cart.total;
        this.total = cart.total;
    }

    ngOnDestroy(): void {
        console.log('Checkout ngOnDestroy called');

        // Unsubscribe from cart
        if (this.cartSubscription) {
            this.cartSubscription.unsubscribe();
        }

        // Reset Stripe when leaving checkout to clean up state
        this.paymentService.resetStripe();

        // Don't destroy cardElement here - the CheckoutForm presenter handles that
    }
}
