export interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrls: string[];
    description?: string;
}
