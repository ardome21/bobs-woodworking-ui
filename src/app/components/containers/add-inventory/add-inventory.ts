import { Component } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { AddInventoryForm } from '../../presenters/add-inventory-form/add-inventory-form';

@Component({
    selector: 'app-add-inventory',
    imports: [ReactiveFormsModule, AddInventoryForm],
    templateUrl: './add-inventory.html',
    styleUrl: './add-inventory.scss',
})
export class AddInventory {
    inventoryForm: FormGroup;

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
            // TODO: Call your API service here
            this.inventoryForm.reset();
        } else {
            Object.keys(this.inventoryForm.controls).forEach((key) => {
                this.inventoryForm.get(key)?.markAsTouched();
            });
        }
    }
}
