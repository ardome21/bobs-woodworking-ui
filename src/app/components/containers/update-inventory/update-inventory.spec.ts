import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInventory } from './update-inventory';

describe('UpdateInventory', () => {
  let component: UpdateInventory;
  let fixture: ComponentFixture<UpdateInventory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateInventory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateInventory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
