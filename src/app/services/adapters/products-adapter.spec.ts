import { TestBed } from '@angular/core/testing';

import { ProductsAdapter } from './products-adapter';

describe('ProductsAdapter', () => {
  let service: ProductsAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
