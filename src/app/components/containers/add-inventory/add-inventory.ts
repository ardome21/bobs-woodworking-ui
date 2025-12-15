import { Component, inject } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { AddInventoryForm } from '../../presenters/add-inventory-form/add-inventory-form';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Products } from '../../../services/products';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-add-inventory',
    imports: [
        ReactiveFormsModule,
        AddInventoryForm,
        MatButtonModule,
        RouterModule,
    ],
    templateUrl: './add-inventory.html',
    styleUrl: './add-inventory.scss',
})
export class AddInventory {
    inventoryForm: FormGroup;

    private _productService = inject(Products);

    private snackBar = inject(MatSnackBar);

    constructor(private fb: FormBuilder) {
        this.inventoryForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]],
            description: ['', [Validators.required, Validators.minLength(10)]],
            price: ['', [Validators.required, Validators.min(0)]],
            images: [null],
        });
    }

    onSubmit() {
        if (this.inventoryForm.valid) {
            console.log('Form submitted:', this.inventoryForm.value);
            const formData = new FormData();
            const formValues = this.inventoryForm.value;
            formData.append('title', formValues.title);
            formData.append('description', formValues.description);
            formData.append('price', formValues.price.toString());
            console.log('Form Data prepared:', formData);
            // Append images
            if (formValues.images && formValues.images.length > 0) {
                formValues.images.forEach((file: File) => {
                    formData.append('images', file);
                });
            }
            this._productService.addProduct(formData).subscribe({
                next: () => {
                    console.log('Product added successfully');
                    this.snackBar.open('Product added successfully!', 'Close', {
                        duration: 3000,
                        panelClass: 'snackbar-success',
                    });
                    this.inventoryForm.reset();
                    Object.keys(this.inventoryForm.controls).forEach((key) => {
                        this.inventoryForm.get(key)?.setErrors(null);
                        this.inventoryForm.get(key)?.markAsUntouched();
                        this.inventoryForm.get(key)?.markAsPristine();
                    });
                },
                error: (res) => {
                    console.error('Error adding product:', res);
                    this.snackBar.open(
                        'Error adding product: ' + res.error.error,
                        'Close',
                        { panelClass: 'snackbar-error' },
                    );
                    Object.keys(this.inventoryForm.controls).forEach((key) => {
                        this.inventoryForm.get(key)?.markAsTouched();
                    });
                },
            });
        } else {
            Object.keys(this.inventoryForm.controls).forEach((key) => {
                this.inventoryForm.get(key)?.markAsTouched();
            });
        }
    }
}
