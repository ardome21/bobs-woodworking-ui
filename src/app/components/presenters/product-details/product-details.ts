import {
    Component,
    EventEmitter,
    inject,
    Input,
    Output,
    signal,
    computed,
} from '@angular/core';
import { Product } from '../../../models/products';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductsApi } from '../../../repository/services/products-api';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../../services/loading.service';
import { Products } from '../../../services/products';

@Component({
    selector: 'app-product-details',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
    ],
    templateUrl: './product-details.html',
    styleUrls: ['./product-details.scss'],
})
export class ProductDetails {
    @Input() product: Product | null = null;
    @Input() editView: boolean = false;
    @Output() productDeleted = new EventEmitter<void>();
    @Output() productUpdated = new EventEmitter<void>();

    private productsApi = inject(ProductsApi);
    private productsService = inject(Products);
    private router = inject(Router);
    private loadingService = inject(LoadingService);

    editedProduct: {
        name: string;
        price: number;
        description: string;
        imageUrl: string;
    } | null = null;

    selectedFile: File | null = null;
    previewImageUrl = signal<string | null>(null);

    isSaving = computed(() => this.loadingService.isLoadingKey('product-save'));

    ngOnChanges(): void {
        if (this.product && this.editView) {
            this.editedProduct = {
                name: this.product.name,
                price: this.product.price,
                description: this.product.description || '',
                imageUrl: this.product.imageUrl,
            };
            this.previewImageUrl.set(null);
        }
    }

    hasChanges(): boolean {
        if (!this.product || !this.editedProduct) return false;

        return (
            this.editedProduct.name !== this.product.name ||
            this.editedProduct.price !== this.product.price ||
            this.editedProduct.description !==
                (this.product.description || '') ||
            this.selectedFile !== null
        );
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];

            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    // Use signal to trigger reactivity
                    this.previewImageUrl.set(e.target.result as string);
                }
            };
            reader.readAsDataURL(this.selectedFile);
        }
    }

    saveChanges(): void {
        if (!this.product || !this.editedProduct || this.isSaving()) return;

        this.loadingService.setLoading('product-save', true);

        const formData = new FormData();
        formData.append('title', this.editedProduct.name);
        formData.append('price', this.editedProduct.price.toString());
        formData.append('description', this.editedProduct.description);

        if (this.selectedFile) {
            formData.append('images', this.selectedFile);
        }

        this.productsApi.updateProduct(this.product.id, formData).subscribe({
            next: (response) => {
                console.log('Product updated:', response);
                this.productUpdated.emit();
                this.selectedFile = null;
                this.previewImageUrl.set(null);
            },
            error: (error) => {
                console.error('Error updating product:', error);
            },
        });
        this.productsService.getProductById(this.product.id).subscribe({
            next: (response) => {
                this.product = response;
                this.loadingService.setLoading('product-save', false);
            },
            error: (error) => {
                console.error('Error updating product:', error);
                this.loadingService.setLoading('product-save', false);
            },
        });
    }

    deleteProduct(): void {
        if (!this.product) return;

        if (
            confirm(`Are you sure you want to delete "${this.product.name}"?`)
        ) {
            this.loadingService.setLoading('product-delete', true);
            this.productsApi.deleteProduct(this.product.id).subscribe({
                next: (response) => {
                    console.log('Product deleted:', response);
                    this.loadingService.setLoading('product-delete', false);
                    this.productDeleted.emit();
                    this.router.navigate(['/update-inventory']);
                },
                error: (error) => {
                    console.error('Error deleting product:', error);
                    this.loadingService.setLoading('product-delete', false);
                },
            });
        }
    }
}
