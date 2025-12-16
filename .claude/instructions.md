# Bob's Woodworking UI - Claude Instructions

## Architecture Patterns to Enforce

This project follows **strict architectural patterns**. Always enforce these rules:

### 1. Presenter/Container Pattern

**Presenters (Dumb Components):**
- Location: `src/app/components/presenters/`
- ✅ Receive data via `@Input()`
- ✅ Emit events via `@Output()`
- ✅ Only UI logic (forms, validation display, file previews)
- ❌ NEVER inject business logic services
- ❌ NEVER make API calls
- ❌ NEVER navigate with Router

**Containers (Smart Components):**
- Location: `src/app/components/containers/`
- ✅ Inject domain services (e.g., `Products`)
- ✅ Handle business logic
- ✅ React to presenter events
- ✅ Navigate, manage state
- ❌ NEVER inject API services (e.g., `ProductsApi`)

### 2. Repository Pattern with Adapters

**CRITICAL RULE:** Containers MUST inject domain services, NOT API services.

**Data Flow:**
```
Container → Domain Service (Products) → Adapter → API Service (ProductsApi) → HTTP
```

**Examples:**

❌ **WRONG:**
```typescript
// In container - FORBIDDEN
private productsApi = inject(ProductsApi);
this.productsApi.updateProduct(id, data).subscribe(...);
```

✅ **CORRECT:**
```typescript
// In container - REQUIRED
private productService = inject(Products);
this.productService.updateProduct(id, data).subscribe(...);
```

### 3. Service Injection Rules

**Presenters can ONLY inject:**
- UI services: `FocusMonitor`, `AnimationBuilder`, `LiveAnnouncer`
- Form building: `FormBuilder` (for local state only)
- ❌ NEVER: API services, domain services, Router

**Containers can ONLY inject:**
- Domain services: `Products`, `AuthService` (NOT `ProductsApi`)
- UI services: `Router`, `LoadingService`, etc.
- ❌ NEVER: API services like `ProductsApi`, `HttpClient`

### 4. Code Review Checks

Before completing any task, verify:

- [ ] No presenters inject business logic services
- [ ] No containers inject API services (e.g., `ProductsApi`)
- [ ] All API calls go through domain services
- [ ] Presenters emit events, containers handle them
- [ ] No business logic in presenters
- [ ] All API responses go through adapters

## Reference

For detailed examples and patterns, see `ARCHITECTURE.md` in the project root.

## When Making Changes

1. **Before editing containers:** Verify they only inject domain services
2. **Before editing presenters:** Verify they only emit events, no service calls
3. **Before adding new services:** Ensure adapters transform API data
4. **After any refactoring:** Run code review checklist above

## Project Structure

```
src/app/
├── components/
│   ├── presenters/      # Dumb components (UI only)
│   └── containers/      # Smart components (domain services only)
├── services/            # Domain services (Products, Auth, etc.)
│   └── adapters/        # Data transformation layer
└── repository/          # API services (ONLY called by domain services)
```
