import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Game {
  id: number;
  title: string;
  price: number;
  available: boolean;
}

@Component({
  selector: 'app-game-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './game-list.html',
  styleUrl: './game-list.css'
})
export class GameListComponent {
  newGameTitle: string = '';
  newGamePrice: number = 0;

  games: Game[] = [
    { id: 1, title: 'Half-Life 3', price: 29.99, available: true },
    { id: 2, title: 'Cyberpunk 2077', price: 49.99, available: false },
    { id: 3, title: 'Portal 3', price: 19.99, available: true }
  ];

  addGame(): void {
    if (this.newGameTitle.trim() === '') return;

    const newGame: Game = {
      id: this.games.length + 1,
      title: this.newGameTitle,
      price: this.newGamePrice,
      available: true
    };

    this.games.push(newGame);
    this.newGameTitle = '';
    this.newGamePrice = 0;
  }

  toggleAvailability(game: Game): void {
    game.available = !game.available;
  }
}
