import {
    Component,
    EventEmitter,
    Input,
    Output,
    signal,
} from '@angular/core';
import { Product } from '../../../models/products';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

export interface ProductUpdateData {
    id: number;
    formData: FormData;
}

@Component({
    selector: 'app-product-details',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
    ],
    templateUrl: './product-details.html',
    styleUrls: ['./product-details.scss'],
})
export class ProductDetails {
    @Input() product: Product | null = null;
    @Input() editView: boolean = false;
    @Input() isSaving: boolean = false;
    @Input() isInCart: boolean = false;
    @Input() cartQuantity: number = 0;
    @Output() productDeleted = new EventEmitter<number>();
    @Output() productUpdated = new EventEmitter<ProductUpdateData>();
    @Output() addedToCart = new EventEmitter<{ product: Product; quantity: number }>();
    @Output() removedFromCart = new EventEmitter<number>();
    @Output() cartQuantityChanged = new EventEmitter<{ productId: number; quantity: number }>();

    editedProduct: {
        name: string;
        price: number;
        quantity: number;
        description: string;
        imageUrls: string[];
    } | null = null;

    selectedFiles: File[] = [];
    previewImageUrls = signal<string[]>([]);
    currentImageIndex: number = 0;
    imagesToDelete: Set<number> = new Set();
    selectedQuantity: number = 1;

    ngOnChanges(): void {
        if (this.product && this.editView) {
            this.editedProduct = {
                name: this.product.name,
                price: this.product.price,
                quantity: this.product.quantity,
                description: this.product.description || '',
                imageUrls: this.product.imageUrls,
            };
            this.previewImageUrls.set([]);
            this.selectedFiles = [];
            this.imagesToDelete.clear();
            this.currentImageIndex = 0;
        }
    }

    hasChanges(): boolean {
        if (!this.product || !this.editedProduct) return false;

        return (
            this.editedProduct.name !== this.product.name ||
            this.editedProduct.price !== this.product.price ||
            this.editedProduct.quantity !== this.product.quantity ||
            this.editedProduct.description !==
                (this.product.description || '') ||
            this.selectedFiles.length > 0 ||
            this.imagesToDelete.size > 0
        );
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const newFiles = Array.from(input.files);
            this.selectedFiles.push(...newFiles);

            const newPreviews: string[] = [];
            let filesProcessed = 0;

            newFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (e: ProgressEvent<FileReader>) => {
                    if (e.target?.result) {
                        newPreviews.push(e.target.result as string);
                        filesProcessed++;

                        if (filesProcessed === newFiles.length) {
                            this.previewImageUrls.set([...this.previewImageUrls(), ...newPreviews]);
                        }
                    }
                };
                reader.readAsDataURL(file);
            });

            // Reset the input so the same file can be selected again
            input.value = '';
        }
    }

    saveChanges(): void {
        if (!this.product || !this.editedProduct || this.isSaving) return;

        const formData = new FormData();
        formData.append('title', this.editedProduct.name);
        formData.append('price', this.editedProduct.price.toString());
        formData.append('quantity', this.editedProduct.quantity.toString());
        formData.append('description', this.editedProduct.description);

        // Add existing images that should be kept (not marked for deletion)
        const existingImagesToKeep = this.product.imageUrls.filter(
            (_, index) => !this.imagesToDelete.has(index)
        );

        // Extract S3 keys from signed URLs (remove query parameters)
        const s3Keys = existingImagesToKeep.map((url) => {
            try {
                const urlObj = new URL(url);
                // Get pathname and remove leading slash
                // Example: "/products/25002/2" -> "products/25002/2"
                return urlObj.pathname.substring(1);
            } catch {
                // If URL parsing fails, return as-is
                return url;
            }
        });

        // Send existing images as JSON array in 'existing_images' field
        if (s3Keys.length > 0) {
            formData.append('existing_images', JSON.stringify(s3Keys));
        }

        // Add new image files as blobs to the 'images' field
        this.selectedFiles.forEach((file) => {
            formData.append('images', file);
        });

        this.productUpdated.emit({
            id: this.product.id,
            formData: formData,
        });

        // Don't clear state here - let ngOnChanges handle it when fresh data arrives
        // This prevents the UI flicker of images disappearing/reappearing during save
    }

    deleteProduct(): void {
        if (!this.product) return;

        if (
            confirm(`Are you sure you want to delete "${this.product.name}"?`)
        ) {
            this.productDeleted.emit(this.product.id);
        }
    }

    getCurrentImageUrl(): string {
        if (!this.product || !this.product.imageUrls.length) {
            return '';
        }
        return this.product.imageUrls[this.currentImageIndex] || '';
    }

    hasMultipleImages(): boolean {
        return this.product ? this.product.imageUrls.length > 1 : false;
    }

    previousImage(event: Event): void {
        event.stopPropagation();
        if (!this.product) return;
        this.currentImageIndex = this.currentImageIndex === 0
            ? this.product.imageUrls.length - 1
            : this.currentImageIndex - 1;
    }

    nextImage(event: Event): void {
        event.stopPropagation();
        if (!this.product) return;
        this.currentImageIndex = (this.currentImageIndex + 1) % this.product.imageUrls.length;
    }

    getDisplayImages(): string[] {
        if (!this.product) return [];

        // Filter out images marked for deletion
        const existingImages = this.product.imageUrls.filter((_, index) => !this.imagesToDelete.has(index));

        // Combine with preview images
        return [...existingImages, ...this.previewImageUrls()];
    }

    deleteExistingImage(index: number, event: Event): void {
        event.stopPropagation();
        if (!this.product) return;

        this.imagesToDelete.add(index);
    }

    deletePreviewImage(previewIndex: number, event: Event): void {
        event.stopPropagation();

        const currentPreviews = this.previewImageUrls();
        currentPreviews.splice(previewIndex, 1);
        this.previewImageUrls.set([...currentPreviews]);

        this.selectedFiles.splice(previewIndex, 1);
    }

    isImageMarkedForDeletion(index: number): boolean {
        return this.imagesToDelete.has(index);
    }

    getMaxQuantity(): number {
        if (!this.product) return 1;
        return Math.min(5, this.product.quantity);
    }

    increaseQuantity(): void {
        if (this.selectedQuantity < this.getMaxQuantity()) {
            this.selectedQuantity++;
        }
    }

    decreaseQuantity(): void {
        if (this.selectedQuantity > 1) {
            this.selectedQuantity--;
        }
    }

    validateQuantity(): void {
        const max = this.getMaxQuantity();
        if (this.selectedQuantity < 1) {
            this.selectedQuantity = 1;
        } else if (this.selectedQuantity > max) {
            this.selectedQuantity = max;
        }
    }

    addToCart(): void {
        if (!this.product) return;

        this.addedToCart.emit({
            product: this.product,
            quantity: this.selectedQuantity
        });
    }

    removeFromCart(): void {
        if (!this.product) return;

        this.removedFromCart.emit(this.product.id);
    }

    increaseCartQuantity(): void {
        if (!this.product || this.cartQuantity >= 5) return;

        this.cartQuantityChanged.emit({
            productId: this.product.id,
            quantity: this.cartQuantity + 1
        });
    }

    decreaseCartQuantity(): void {
        if (!this.product || this.cartQuantity <= 1) return;

        this.cartQuantityChanged.emit({
            productId: this.product.id,
            quantity: this.cartQuantity - 1
        });
    }
}
