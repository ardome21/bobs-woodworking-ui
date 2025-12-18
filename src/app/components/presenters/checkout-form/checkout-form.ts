import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StripeCardElement, StripeElements } from '@stripe/stripe-js';

@Component({
    selector: 'app-checkout-form',
    imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
    templateUrl: './checkout-form.html',
    styleUrls: ['./checkout-form.scss'],
})
export class CheckoutForm implements OnInit, AfterViewInit, OnDestroy {
    @Input() stripeElements!: StripeElements;
    @Output() formReady = new EventEmitter<{ form: FormGroup; cardElement: StripeCardElement }>();

    shippingForm!: FormGroup;
    cardElement!: StripeCardElement;
    cardError: string | null = null;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.shippingForm = this.fb.group({
            name: ['', Validators.required],
            street: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            zip: ['', Validators.required],
            country: ['USA', Validators.required],
        });
    }

    ngAfterViewInit(): void {
        console.log('CheckoutForm ngAfterViewInit - stripeElements:', this.stripeElements);

        // Only create card element if it hasn't been created yet
        if (this.stripeElements && !this.cardElement) {
            try {
                this.cardElement = this.stripeElements.create('card', {
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#32325d',
                            fontFamily: '"Roboto", sans-serif',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#f44336',
                        },
                    },
                });

                console.log('Card element created:', this.cardElement);

                this.cardElement.mount('#card-element');
                console.log('Card element mounted to #card-element');

                this.cardElement.on('change', (event) => {
                    this.cardError = event.error ? event.error.message : null;
                });

                this.formReady.emit({ form: this.shippingForm, cardElement: this.cardElement });
            } catch (error) {
                console.error('Error creating/mounting card element:', error);
            }
        } else if (this.cardElement) {
            console.log('Card element already exists, skipping creation');
            this.formReady.emit({ form: this.shippingForm, cardElement: this.cardElement });
        } else {
            console.error('stripeElements is not available in ngAfterViewInit');
        }
    }

    ngOnDestroy(): void {
        if (this.cardElement) {
            this.cardElement.destroy();
        }
    }
}
