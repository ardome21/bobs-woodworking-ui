import { TestBed } from '@angular/core/testing';

import { UserAdapter } from './user-adapter';

describe('UserAdapter', () => {
  let service: UserAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
