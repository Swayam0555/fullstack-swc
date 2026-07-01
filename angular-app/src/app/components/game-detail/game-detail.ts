import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GameService, Game } from '../../services/game';

@Component({
  selector: 'app-game-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.css'
})
export class GameDetailComponent implements OnInit {
  game: Game | undefined;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    const gameId = Number(this.route.snapshot.paramMap.get('id'));

    this.gameService.getGames().subscribe({
      next: (games: Game[]) => {
        this.game = games.find(g => g.id === gameId);
      }
    });
  }
}
