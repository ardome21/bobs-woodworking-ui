import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { UserProfile } from '../../../models/user-profile';

@Component({
    selector: 'app-checkout-form',
    imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule],
    templateUrl: './checkout-form.html',
    styleUrls: ['./checkout-form.scss'],
})
export class CheckoutForm implements OnInit, AfterViewInit, OnDestroy, OnChanges {
    @Input() stripeElements!: StripeElements;
    @Input() savedAddresses: { [key: string]: any } = {};
    @Input() isLoggedIn: boolean = false;
    @Input() userProfile: UserProfile | null = null;
    @Output() formReady = new EventEmitter<{ form: FormGroup; cardElement: StripeCardElement }>();
    @Output() saveAddress = new EventEmitter<{ nickname: string; address: any }>();

    shippingForm!: FormGroup;
    cardElement!: StripeCardElement;
    cardError: string | null = null;
    selectedSavedAddress: string = '';
    saveCurrentAddress: boolean = true;
    addressNickname: string = '';

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        // Name is only required if user is not logged in OR is a guest
        const isRealUser = this.isLoggedIn && this.userProfile?.role !== 'guest';
        const nameValidators = isRealUser ? [] : [Validators.required];

        // Pre-fill name for guests
        let defaultName = '';
        if (this.userProfile?.role === 'guest') {
            defaultName = `${this.userProfile.firstName} ${this.userProfile.lastName}`.trim();
        }

        this.shippingForm = this.fb.group({
            name: [defaultName, nameValidators],
            street: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            zip: ['', Validators.required],
            country: ['USA', Validators.required],
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['savedAddresses'] && this.savedAddresses) {
            // Reset selection if saved addresses change
            this.selectedSavedAddress = '';
        }

        // Update name field when userProfile changes (e.g., when guest logs in)
        if (changes['userProfile'] && this.shippingForm && this.userProfile?.role === 'guest') {
            const guestName = `${this.userProfile.firstName} ${this.userProfile.lastName}`.trim();
            if (guestName && !this.shippingForm.get('name')?.value) {
                this.shippingForm.patchValue({ name: guestName });
            }
        }
    }

    onSavedAddressChange(nickname: string): void {
        if (nickname && this.savedAddresses[nickname]) {
            const address = this.savedAddresses[nickname];
            this.shippingForm.patchValue({
                name: address.name,
                street: address.street,
                city: address.city,
                state: address.state,
                zip: address.zip,
                country: address.country
            });
            this.saveCurrentAddress = false;
        }
    }

    getSavedAddressKeys(): string[] {
        return Object.keys(this.savedAddresses);
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
