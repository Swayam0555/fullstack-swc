import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameCardComponent } from './game-card';
import { CartService } from '../../services/cart';
import { provideRouter } from '@angular/router';

describe('GameCardComponent', () => {
  let component: GameCardComponent;
  let fixture: ComponentFixture<GameCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCardComponent],
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: { addToCart: () => {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameCardComponent);
    component = fixture.componentInstance;
    component.game = { id: 1, title: 'Mock Game', price: 9.99, available: true };
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
