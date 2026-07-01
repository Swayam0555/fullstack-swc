import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Game {
  id: number;
  title: string;
  price: number;
  available?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://127.0.0.1:8000/api/games/';

  constructor(private http: HttpClient) {}

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  addGame(title: string, price: number): Observable<Game> {
    const payload = {
      title: title,
      price: price,
      publisher: 1
    };

    return this.http.post<Game>(this.apiUrl, payload).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code ${error.status}, body was: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
