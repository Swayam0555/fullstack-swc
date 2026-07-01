import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddGameFormComponent } from './add-game-form';
import { provideRouter } from '@angular/router';

describe('AddGameFormComponent', () => {
  let component: AddGameFormComponent;
  let fixture: ComponentFixture<AddGameFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGameFormComponent],
      providers: [
        provideRouter([])
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
