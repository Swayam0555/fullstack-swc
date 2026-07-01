import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Game } from '../../services/game';
import { KeyFormatPipe } from '../../pipes/key-format-pipe';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-game-card',
  imports: [CommonModule, KeyFormatPipe, RouterModule],
  templateUrl: './game-card.html',
  styleUrl: './game-card.css'
})
export class GameCardComponent {
  @Input() game!: Game;
  
  mockKey: string = 'a3f9b21c4de79901cc84';

  @Output() remove = new EventEmitter<number>();

  constructor(private cartService: CartService) {}

  onRemoveClick(): void {
    this.remove.emit(this.game.id);
  }

  addToCart(): void {
    this.cartService.addToCart(this.game);
  }

  toggleAvailability(): void {
    this.game.available = !this.game.available;
  }
}
