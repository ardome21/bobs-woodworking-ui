import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Cart } from '../models/cart';
import { Product } from '../models/products';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'bw3_cart';
  private cartSubject = new BehaviorSubject<CartItem[]>(this.loadCartFromStorage());

  // Expose cart as observable
  public cart$ = this.cartSubject.asObservable();

  // Expose cart item count as signal for reactive UI
  public itemCount = signal<number>(this.calculateItemCount());

  constructor() {
    // Update item count whenever cart changes
    this.cart$.subscribe(items => {
      this.itemCount.set(this.calculateItemCount());
    });
  }

  /**
   * Load cart from LocalStorage
   */
  private loadCartFromStorage(): CartItem[] {
    try {
      const cartData = localStorage.getItem(this.STORAGE_KEY);
      if (cartData) {
        return JSON.parse(cartData);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
    return [];
  }

  /**
   * Save cart to LocalStorage
   */
  private saveCartToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  /**
   * Calculate total number of items in cart
   */
  private calculateItemCount(): number {
    const items = this.cartSubject.value;
    return items.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Get current cart items
   */
  getCart(): CartItem[] {
    return this.cartSubject.value;
  }

  /**
   * Get cart with calculated totals
   */
  getCartWithTotals(): Cart {
    const items = this.cartSubject.value;
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const itemCount = this.calculateItemCount();

    return {
      items,
      total,
      itemCount
    };
  }

  /**
   * Add product to cart
   */
  addToCart(product: Product, quantity: number = 1): void {
    const items = [...this.cartSubject.value];

    // Check if product already exists in cart
    const existingItemIndex = items.findIndex(item => item.product_id === product.id);

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      items[existingItemIndex].quantity += quantity;
      items[existingItemIndex].subtotal = items[existingItemIndex].quantity * items[existingItemIndex].unit_price;
    } else {
      // Add new item to cart
      const newItem: CartItem = {
        product_id: product.id,
        product_name: product.name,
        quantity: quantity,
        unit_price: product.price,
        imageUrl: product.imageUrls[0] || '', // Use first image
        subtotal: product.price * quantity
      };
      items.push(newItem);
    }

    this.cartSubject.next(items);
    this.saveCartToStorage(items);
  }

  /**
   * Update quantity of item in cart
   */
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const items = [...this.cartSubject.value];
    const itemIndex = items.findIndex(item => item.product_id === productId);

    if (itemIndex >= 0) {
      items[itemIndex].quantity = quantity;
      items[itemIndex].subtotal = items[itemIndex].quantity * items[itemIndex].unit_price;

      this.cartSubject.next(items);
      this.saveCartToStorage(items);
    }
  }

  /**
   * Remove item from cart
   */
  removeFromCart(productId: number): void {
    const items = this.cartSubject.value.filter(item => item.product_id !== productId);
    this.cartSubject.next(items);
    this.saveCartToStorage(items);
  }

  /**
   * Clear entire cart
   */
  clearCart(): void {
    this.cartSubject.next([]);
    this.saveCartToStorage([]);
  }

  /**
   * Get cart total
   */
  getCartTotal(): number {
    return this.cartSubject.value.reduce((sum, item) => sum + item.subtotal, 0);
  }

  /**
   * Check if product is in cart
   */
  isInCart(productId: number): boolean {
    return this.cartSubject.value.some(item => item.product_id === productId);
  }

  /**
   * Get quantity of product in cart
   */
  getProductQuantity(productId: number): number {
    const item = this.cartSubject.value.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  }
}
