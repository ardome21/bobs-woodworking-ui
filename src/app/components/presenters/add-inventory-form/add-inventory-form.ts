import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-add-inventory-form',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './add-inventory-form.html',
    styleUrl: './add-inventory-form.scss',
})
export class AddInventoryForm {
    @Input() formGroup!: FormGroup;
    @Output() formSubmit = new EventEmitter<void>();

    selectedFiles: File[] = [];
    previewUrls = signal<string[]>([]);

    onFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.previewUrls.set([]);
            this.selectedFiles = Array.from(input.files);
            console.log('Selected files:', this.selectedFiles);
            this.selectedFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.previewUrls.update((urls) => [
                        ...urls,
                        e.target?.result as string,
                    ]);
                };
                reader.readAsDataURL(file);
            });

            this.formGroup.patchValue({ images: this.selectedFiles });
        }
        console.log('FormGroup after file select:', this.formGroup.value);
        console.log('Preview URLs:', this.previewUrls);
    }

    removeImage(index: number) {
        this.selectedFiles.splice(index, 1);
        this.previewUrls.update((urls) => {
            const newUrls = [...urls];
            newUrls.splice(index, 1);
            return newUrls;
        });
        this.formGroup.patchValue({
            images: this.selectedFiles.length ? this.selectedFiles : null,
        });
    }

    onSubmit() {
        this.formSubmit.emit();
    }

    getErrorMessage(controlName: string): string {
        const control = this.formGroup.get(controlName);
        if (control?.hasError('required')) {
            return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
        }
        if (control?.hasError('minlength')) {
            const minLength = control.errors?.['minlength'].requiredLength;
            return `Minimum ${minLength} characters required`;
        }
        if (control?.hasError('min')) {
            return 'Price must be greater than 0';
        }
        return '';
    }
}
