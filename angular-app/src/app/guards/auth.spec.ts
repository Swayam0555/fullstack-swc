import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth';
import { AuthService } from '../services/auth';
import { vi } from 'vitest';

describe('authGuard', () => {
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: vi.fn()
    };
    routerMock = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
  });

  it('should allow navigation if user is authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('should redirect and block navigation if user is not authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/games']);
  });
});
