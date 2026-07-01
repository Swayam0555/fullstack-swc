import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddGameFormComponent } from './add-game-form';
import { provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
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
      imports: [AddGameFormComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        { provide: GameService, useClass: MockGameService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddGameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls', () => {
    expect(component.gameForm).toBeDefined();
    expect(component.title?.value).toBe('');
    expect(component.price?.value).toBe(0);
  });

  it('should show form invalid status on empty fields', () => {
    expect(component.gameForm.valid).toBe(false);
  });

  it('should validate title custom uppercase rule', () => {
    const titleControl = component.title;
    
    // Set lowercase title value
    titleControl?.setValue('portal 3');
    expect(titleControl?.valid).toBe(false);
    expect(titleControl?.errors?.['titleLowercase']).toBe(true);

    // Set valid uppercase value
    titleControl?.setValue('Portal 3');
    expect(titleControl?.valid).toBe(true);
  });
});
