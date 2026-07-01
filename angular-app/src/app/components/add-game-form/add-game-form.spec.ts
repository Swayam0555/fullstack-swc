import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddGameFormComponent } from './add-game-form';
import { provideRouter } from '@angular/router';
import { GameService } from '../../services/game';
import { of } from 'rxjs';

class MockGameService {
  addGame(title: string, price: number) {
    return of({ id: 4, title, price, available: true });
  }
}

describe('AddGameFormComponent', () => {
  let component: AddGameFormComponent;
  let fixture: ComponentFixture<AddGameFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGameFormComponent],
      providers: [
        provideRouter([]),
        { provide: GameService, useClass: MockGameService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddGameFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
