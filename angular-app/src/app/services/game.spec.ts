import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GameService, Game } from './game';

describe('GameService', () => {
  let service: GameService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GameService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(GameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch games list via HTTP GET', () => {
    const mockGames: Game[] = [
      { id: 1, title: 'Portal 3', price: 29.99, available: true }
    ];

    service.getGames().subscribe(games => {
      expect(games.length).toBe(1);
      expect(games[0].title).toBe('Portal 3');
    });

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/games/');
    expect(req.request.method).toBe('GET');
    
    req.flush(mockGames);
  });
});
