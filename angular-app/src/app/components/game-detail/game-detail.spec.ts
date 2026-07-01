import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameDetailComponent } from './game-detail';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game';
import { of } from 'rxjs';

class MockGameService {
  getGames() {
    return of([
      { id: 1, title: 'Half-Life 3', price: 29.99, available: true }
    ]);
  }
}

describe('GameDetailComponent', () => {
  let component: GameDetailComponent;
  let fixture: ComponentFixture<GameDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1'
              }
            }
          }
        },
        { provide: GameService, useClass: MockGameService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
