import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve token', () => {
    service.setToken('test-token-xyz');
    expect(service.getToken()).toBe('test-token-xyz');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should clear token on logout', () => {
    service.setToken('test-token-xyz');
    service.logout();
    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });
});
