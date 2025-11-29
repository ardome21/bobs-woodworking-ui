import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationSuccessComponent } from './confirmation-success.component';

describe('ConfirmationSuccessComponent', () => {
  let component: ConfirmationSuccessComponent;
  let fixture: ComponentFixture<ConfirmationSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
