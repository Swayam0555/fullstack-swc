import { TestBed } from '@angular/core/testing';
import { CartService } from './cart';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add games to cart and compute totals', () => {
    const game1 = { id: 1, title: 'Doom Eternal', price: 19.99, available: true };
    const game2 = { id: 2, title: 'Bioshock', price: 9.99, available: true };

    service.addToCart(game1);
    expect(service.totalItems()).toBe(1);
    expect(service.totalPrice()).toBeCloseTo(19.99, 2);

    service.addToCart(game2);
    expect(service.totalItems()).toBe(2);
    expect(service.totalPrice()).toBeCloseTo(29.98, 2);
  });

  it('should remove game from cart', () => {
    const game1 = { id: 1, title: 'Doom Eternal', price: 19.99, available: true };
    service.addToCart(game1);
    service.removeFromCart(1);
    expect(service.totalItems()).toBe(0);
    expect(service.totalPrice()).toBeCloseTo(0, 2);
  });

  it('should clear cart', () => {
    const game1 = { id: 1, title: 'Doom Eternal', price: 19.99, available: true };
    service.addToCart(game1);
    service.clearCart();
    expect(service.totalItems()).toBe(0);
  });
});
