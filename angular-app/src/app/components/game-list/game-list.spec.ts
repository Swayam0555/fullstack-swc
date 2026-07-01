import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameListComponent } from './game-list';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game';
import { CartService } from '../../services/cart';
import { of } from 'rxjs';

class MockGameService {
  getGames() {
    return of([
      { id: 1, title: 'Half-Life 3', price: 29.99, available: true }
    ]);
  }
  addGame(title: string, price: number) {
    return of({ id: 4, title, price, available: true });
  }
}

describe('GameListComponent', () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameListComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => null
              }
            }
          }
        },
        { provide: GameService, useClass: MockGameService },
        { provide: CartService, useValue: { addToCart: () => {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
