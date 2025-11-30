import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInventoryForm } from './add-inventory-form';

describe('AddInventoryForm', () => {
  let component: AddInventoryForm;
  let fixture: ComponentFixture<AddInventoryForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInventoryForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInventoryForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
