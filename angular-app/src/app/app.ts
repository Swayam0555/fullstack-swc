import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameListComponent } from './components/game-list/game-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GameListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-app');
}
