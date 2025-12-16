# Bob's Woodworking UI - Architecture Guide

## Table of Contents
1. [Component Architecture Pattern](#component-architecture-pattern)
2. [Repository Pattern with Adapters](#repository-pattern-with-adapters)
3. [Presenter Components (Dumb)](#presenter-components-dumb)
4. [Container Components (Smart)](#container-components-smart)
5. [Service Injection Guidelines](#service-injection-guidelines)
6. [Real Examples from Our Codebase](#real-examples-from-our-codebase)
7. [Common Pitfalls](#common-pitfalls)

---

## Component Architecture Pattern

This project follows the **Presenter/Container Pattern** (also known as Smart/Dumb Components):

```
┌─────────────────────────────────────┐
│   Container Component (Smart)       │
│   - Injects services                │
│   - Handles business logic          │
│   - Makes API calls                 │
│   - Manages navigation              │
│   - Handles state management        │
└──────────────┬──────────────────────┘
               │ @Input() data
               │ @Output() events
               ▼
┌─────────────────────────────────────┐
│   Presenter Component (Dumb)        │
│   - Receives data via @Input()      │
│   - Emits events via @Output()      │
│   - Pure UI logic only              │
│   - No business logic               │
│   - Highly reusable                 │
└─────────────────────────────────────┘
```

---

## Repository Pattern with Adapters

This project enforces a **strict layered architecture** for data access:

```
┌─────────────────────────────────────────┐
│   Container Components                  │
│   ✅ Inject: Domain Services            │
│   ❌ NEVER inject: API Services         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Domain Services                       │
│   Location: src/app/services/           │
│   Example: Products                     │
│   - Business logic layer                │
│   - Uses adapters for data mapping      │
│   - Exposes clean domain models         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Adapters                              │
│   Location: src/app/services/adapters/  │
│   Example: ProductsAdapter              │
│   - Maps API data to domain models      │
│   - Transforms data structures          │
│   - Handles data normalization          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   API Services (Repository Layer)       │
│   Location: src/app/repository/         │
│   Example: ProductsApi                  │
│   - Direct HTTP calls                   │
│   - Returns raw API responses           │
│   - ONLY called by domain services      │
└─────────────────────────────────────────┘
```

### 🔒 Critical Rule: Containers NEVER Call API Services Directly

**❌ WRONG - Container calling API directly:**
```typescript
@Component({
  selector: 'app-edit-product-page'
})
export class EditProductPage {
  // ❌ FORBIDDEN - Do not inject API services in containers
  private productsApi = inject(ProductsApi);

  onProductUpdated(data: ProductUpdateData): void {
    // ❌ FORBIDDEN - Container bypasses domain layer
    this.productsApi.updateProduct(data.id, data.formData).subscribe(...);
  }
}
```

**✅ CORRECT - Container calling domain service:**
```typescript
@Component({
  selector: 'app-edit-product-page'
})
export class EditProductPage {
  // ✅ CORRECT - Inject domain service
  private productService = inject(Products);

  onProductUpdated(data: ProductUpdateData): void {
    // ✅ CORRECT - Use domain service (which uses adapter internally)
    this.productService.updateProduct(data.id, data.formData).subscribe(
      (product: Product) => {
        // Product is already adapted to domain model
        this.product.set(product);
      }
    );
  }
}
```

### Domain Service Example

**Domain Service:** `src/app/services/products.ts`
```typescript
@Injectable({ providedIn: 'root' })
export class Products {
  private productsApi = inject(ProductsApi);

  // ✅ Adapter transforms API data to domain model
  getProducts(): Observable<Product[]> {
    return this.productsApi
      .getProducts()
      .pipe(map((data) => ProductsAdapter.adaptMany(data.products)));
  }

  getProductById(id: number): Observable<Product> {
    return this.productsApi
      .getProductById(id)
      .pipe(map((data) => ProductsAdapter.adapt(data.product)));
  }

  updateProduct(productId: number, formData: FormData): Observable<Product> {
    return this.productsApi
      .updateProduct(productId, formData)
      .pipe(map((data) => ProductsAdapter.adapt(data.product)));
  }

  deleteProduct(productId: number): Observable<any> {
    return this.productsApi.deleteProduct(productId);
  }

  deleteProducts(productIds: number[]): Observable<any> {
    return this.productsApi.deleteProducts(productIds);
  }
}
```

### Adapter Example

**Adapter:** `src/app/services/adapters/products-adapter.ts`
```typescript
export class ProductsAdapter {
  static adapt(data: ProductData): Product {
    return {
      id: data.id,
      name: data.title,
      price: data.price,
      description: data.description,
      imageUrl: data.image_url,
      // Transform API snake_case to domain camelCase
      // Apply business rules, defaults, etc.
    };
  }

  static adaptMany(data: ProductData[]): Product[] {
    return data.map(item => this.adapt(item));
  }
}
```

### Benefits of This Pattern

1. **Separation of Concerns**
   - Containers focus on UI orchestration
   - Domain services handle business logic
   - API services handle HTTP only

2. **Data Consistency**
   - All API responses go through adapters
   - Domain models are consistent across the app
   - Single source of truth for data transformation

3. **Testability**
   - Easy to mock domain services
   - Adapters can be unit tested independently
   - No HTTP calls in container tests

4. **Flexibility**
   - Can swap API without changing containers
   - Can change API response format (adapter handles it)
   - Can add caching, retry logic in domain service

5. **Type Safety**
   - Domain models have clean TypeScript types
   - API types separate from domain types
   - Compiler catches data shape mismatches

---

## Presenter Components (Dumb)

**Location:** `src/app/components/presenters/`

### Responsibilities ✅

- Display data received via `@Input()` bindings
- Emit user interactions via `@Output()` events
- Handle UI-only concerns:
  - Form rendering and validation display
  - File upload previews
  - UI state (checkboxes, toggles, local form state)
  - Visual feedback (disabled buttons, loading spinners)
- Reusable across different contexts

### Rules

✅ **ALLOWED:**
- `@Input()` properties to receive data
- `@Output()` event emitters
- Local UI state (form models, selection state)
- Pure UI services (see [Service Injection Guidelines](#service-injection-guidelines))

❌ **FORBIDDEN:**
- Direct API/HTTP calls
- Router navigation
- Business logic services
- State management (Store, NgRx)
- Global state services

### Template Example

```typescript
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.html'
})
export class ProductDetails {
  // ✅ Receive data from container
  @Input() product: Product | null = null;
  @Input() editView: boolean = false;
  @Input() isSaving: boolean = false;

  // ✅ Emit events to container
  @Output() productUpdated = new EventEmitter<ProductUpdateData>();
  @Output() productDeleted = new EventEmitter<number>();

  // ✅ Local UI state
  selectedFile: File | null = null;
  previewImageUrl = signal<string | null>(null);

  // ✅ UI logic - just emit the event
  saveChanges(): void {
    const formData = this.buildFormData();
    this.productUpdated.emit({
      id: this.product.id,
      formData: formData
    });
  }

  // ✅ UI logic - file preview
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      // Generate preview URL for UI only
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImageUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }
}
```

---

## Container Components (Smart)

**Location:** `src/app/components/containers/`

### Responsibilities ✅

- Inject and orchestrate **domain services** (NOT API services)
- Handle business logic
- Call domain service methods
- Manage routing and navigation
- Handle loading/error states
- Transform data for presenters
- React to presenter events
- Manage application state

### Rules

✅ **ALLOWED:**
- Domain service injections (e.g., `Products`, `AuthService`)
- UI service injections (`Router`, `LoadingService`, etc.)
- State management services
- Complex business logic
- Error handling
- Side effects (logging, analytics)

🔒 **CRITICAL RULE:**
- **ONLY inject domain services, NEVER inject API services**
- Domain services (e.g., `Products`) handle adapter logic internally
- This ensures consistent data transformation across the app

❌ **FORBIDDEN:**
- Injecting API services (e.g., `ProductsApi`, `HttpClient`)
- Direct HTTP calls (use domain services instead)
- Complex template logic (delegate to presenters)
- Duplicate UI logic

### Template Example

```typescript
@Component({
  selector: 'app-edit-product-page',
  templateUrl: './edit-product-page.html'
})
export class EditProductPage {
  public product = signal<Product | null>(null);
  public isSaving = computed(() =>
    this.loadingService.isLoadingKey('product-save')
  );

  // ✅ Inject domain services (NOT API services)
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(Products); // ✅ Domain service
  private loadingService = inject(LoadingService); // ✅ UI service
  // ❌ private productsApi = inject(ProductsApi); // FORBIDDEN!

  ngOnInit() {
    // ✅ Business logic - load data via domain service
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) this.loadProductInfo(id);
  }

  // ✅ Business logic - call domain service (NOT API directly)
  loadProductInfo(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (data) => this.product.set(data),
      error: (err) => console.error('Error loading product:', err)
    });
  }

  // ✅ Handle event from presenter - call domain service
  onProductUpdated(data: ProductUpdateData): void {
    this.loadingService.setLoading('product-save', true);

    // ✅ Call domain service - adapter handles data transformation
    this.productService.updateProduct(data.id, data.formData).subscribe({
      next: (updatedProduct: Product) => {
        console.log('Product updated:', updatedProduct);
        // Product is already adapted to domain model
        this.product.set(updatedProduct);
        this.loadingService.setLoading('product-save', false);
      },
      error: (error) => {
        console.error('Error updating product:', error);
        this.loadingService.setLoading('product-save', false);
      }
    });
  }

  // ✅ Business logic - navigation after delete
  onProductDeleted(id: number): void {
    this.loadingService.setLoading('product-delete', true);

    // ✅ Call domain service (NOT API directly)
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.loadingService.setLoading('product-delete', false);
        this.router.navigate(['/update-inventory']);
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.loadingService.setLoading('product-delete', false);
      }
    });
  }
}
```

**Template:**
```html
<app-product-details
    [product]="product()"
    [editView]="true"
    [isSaving]="isSaving()"
    (productUpdated)="onProductUpdated($event)"
    (productDeleted)="onProductDeleted($event)"
></app-product-details>
```

---

## Service Injection Guidelines

### ✅ ALLOWED in Presenters (Pure UI Services)

These services deal **only with presentation concerns**:

| Service Type | Example | Reason |
|-------------|---------|--------|
| **Focus Management** | `FocusMonitor`, `FocusTrap` | Pure UI concern |
| **Animations** | `AnimationBuilder` | Visual presentation |
| **Accessibility** | `LiveAnnouncer`, `A11yModule` | UI enhancement |
| **Form Building** | `FormBuilder` | Local form state only |
| **UI State** | `BreakpointObserver` | Responsive UI logic |
| **Dialog/Modal** | `MatDialog`, `MatBottomSheet` | UI components (if presenter owns modal) |

**Example:**
```typescript
@Component({
  selector: 'app-product-form-presenter'
})
export class ProductFormPresenter {
  // ✅ OKAY - tracking focus for UI
  private focusMonitor = inject(FocusMonitor);

  // ✅ OKAY - building local form controls
  private fb = inject(FormBuilder);

  @Input() product: Product;
  @Output() saveProduct = new EventEmitter<Product>();
}
```

### ❌ FORBIDDEN in Presenters (Business Logic Services)

These services contain **business logic** and belong in containers:

| Service Type | Example | Reason |
|-------------|---------|--------|
| **API/HTTP** | `ProductsApi`, `HttpClient` | Business logic |
| **Domain Services** | `ProductsService`, `AuthService` | Business logic |
| **Routing** | `Router`, `ActivatedRoute` | Navigation = business decision |
| **State Management** | `Store`, `StateService` | Business state |
| **Global Loading** | `LoadingService` | Global state management |

**Bad Example:**
```typescript
@Component({
  selector: 'app-product-details'
})
export class ProductDetails {
  // ❌ BAD - API calls are business logic
  private productsApi = inject(ProductsApi);

  // ❌ BAD - navigation is business logic
  private router = inject(Router);

  // ❌ BAD - global state management
  private loadingService = inject(LoadingService);

  saveProduct(): void {
    // ❌ Presenter should NOT do this
    this.productsApi.updateProduct(id, data).subscribe(...);
    this.router.navigate(['/products']);
  }
}
```

**Good Example:**
```typescript
@Component({
  selector: 'app-product-details'
})
export class ProductDetails {
  @Input() product: Product;
  @Input() isSaving: boolean;
  @Output() saveProduct = new EventEmitter<ProductUpdateData>();

  onSave(): void {
    // ✅ Just emit the event - let container handle business logic
    this.saveProduct.emit({
      id: this.product.id,
      formData: this.buildFormData()
    });
  }
}
```

---

## Real Examples from Our Codebase

### Example 1: Product Details

**Presenter:** `src/app/components/presenters/product-details/product-details.ts`
- Displays product information
- Renders edit form
- Handles file upload previews
- Emits `productUpdated` and `productDeleted` events

**Container:** `src/app/components/containers/edit-product-page/edit-product-page.ts`
- Loads product from route params
- Handles save/delete API calls
- Manages loading states
- Navigates after deletion

### Example 2: Edit Products List

**Presenter:** `src/app/components/presenters/edit-products/edit-products.ts`
- Displays product list
- Handles checkbox selection UI
- Emits `deleteProduct` and `deleteSelectedProducts` events

**Container:** `src/app/components/containers/update-inventory/update-inventory.ts`
- Loads all products
- Handles single/bulk delete API calls
- Refreshes product list after deletion

### Example 3: Add Inventory Form

**Presenter:** `src/app/components/presenters/add-inventory-form/add-inventory-form.ts`
- Pure form UI
- File upload previews
- Validation display
- Emits `formSubmit` event

**Container:** `src/app/components/containers/add-inventory/add-inventory.ts`
- Creates FormGroup
- Handles form submission
- Makes API call to add product
- Shows success/error feedback
- Resets form after success

---

## Common Pitfalls

### ❌ Pitfall 1: Putting Business Logic in Presenters

**Bad:**
```typescript
// In presenter
deleteProduct(): void {
  this.productsApi.deleteProduct(id).subscribe(() => {
    this.router.navigate(['/products']);
  });
}
```

**Good:**
```typescript
// In presenter
deleteProduct(): void {
  this.productDeleted.emit(this.product.id);
}

// In container
onProductDeleted(id: number): void {
  this.productsApi.deleteProduct(id).subscribe(() => {
    this.router.navigate(['/products']);
  });
}
```

### ❌ Pitfall 2: Containers Doing Too Much UI Logic

**Bad:**
```typescript
// Container template
<div class="product-card">
  <img [src]="product().imageUrl" />
  <h2>{{ product().name }}</h2>
  <p>{{ product().description }}</p>
  <!-- Tons of complex UI logic in container template -->
</div>
```

**Good:**
```typescript
// Container template
<app-product-details
  [product]="product()"
  (productUpdated)="onProductUpdated($event)"
></app-product-details>

// Presenter handles all UI rendering
```

### ❌ Pitfall 3: Not Passing Loading State to Presenters

**Bad:**
```typescript
// Presenter manages its own loading state
private loadingService = inject(LoadingService);
isSaving = computed(() => this.loadingService.isLoadingKey('save'));
```

**Good:**
```typescript
// Container computes and passes loading state
// Container:
public isSaving = computed(() =>
  this.loadingService.isLoadingKey('save')
);

// Presenter:
@Input() isSaving: boolean = false;
```

### ❌ Pitfall 4: Skipping Containers for "Simple" Pages

Even simple pages benefit from the pattern:

**Bad:**
```typescript
// "Simple" page without container
@Component({
  selector: 'app-products-page',
  template: `
    <div *ngFor="let p of products">{{p.name}}</div>
  `
})
export class ProductsPage {
  products: Product[] = [];

  constructor(private api: ProductsApi) {
    this.api.getProducts().subscribe(p => this.products = p);
  }
}
```

**Good:**
```typescript
// Container (even for simple pages)
@Component({
  selector: 'app-products-page',
  template: `<app-products-list [products]="products()"></app-products-list>`
})
export class ProductsPage {
  products = signal<Product[]>([]);
  private api = inject(ProductsApi);

  ngOnInit() {
    this.api.getProducts().subscribe(p => this.products.set(p));
  }
}

// Reusable presenter
@Component({
  selector: 'app-products-list',
  template: `<div *ngFor="let p of products">{{p.name}}</div>`
})
export class ProductsList {
  @Input() products: Product[] = [];
}
```

---

## Quick Decision Tree

When creating a new component, ask:

```
Does this component need to make API calls,
navigate, or manage business state?
         │
         ├─ YES → Create as CONTAINER
         │        Location: src/app/components/containers/
         │        Can inject: any service
         │
         └─ NO → Create as PRESENTER
                  Location: src/app/components/presenters/
                  Use: @Input(), @Output(), UI services only
```

---

## Code Review Checklist

When reviewing code, check:

### For Presenters:
- [ ] Does this presenter inject any business logic services?
  - If yes → Move to container
- [ ] Does this presenter make API calls?
  - If yes → Move logic to container, emit events instead
- [ ] Does this presenter navigate with Router?
  - If yes → Emit event, let container navigate
- [ ] Is loading state computed in presenter?
  - If yes → Move to container, pass as `@Input()`

### For Containers:
- [ ] 🔒 **Does this container inject API services (e.g., `ProductsApi`, `HttpClient`)?**
  - If yes → **CRITICAL:** Replace with domain service (e.g., `Products`)
- [ ] Does this container call API methods directly?
  - If yes → Replace with domain service method calls
- [ ] Does this container have complex template UI logic?
  - If yes → Extract to presenter component
- [ ] Are adapters being bypassed?
  - If yes → Use domain service to ensure data goes through adapters

### For Domain Services:
- [ ] Does this service use adapters to transform API data?
  - If no → Add adapter logic to ensure consistent domain models
- [ ] Does this service expose domain models (not raw API responses)?
  - If no → Add transformation logic

---

## Further Reading

- [Angular Component Interaction](https://angular.io/guide/component-interaction)
- [Smart vs Presentational Components](https://blog.angular-university.io/angular-2-smart-components-vs-presentation-components-whats-the-difference-when-to-use-each-and-why/)
- [Angular Architecture Best Practices](https://angular.io/guide/architecture)

---

**Last Updated:** 2025-12-16
**Maintained By:** Development Team
