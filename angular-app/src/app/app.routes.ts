import { Routes } from '@angular/router';
import { GameListComponent } from './components/game-list/game-list';
import { GameDetailComponent } from './components/game-detail/game-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'games', pathMatch: 'full' },
  { path: 'games', component: GameListComponent },
  { path: 'games/:id', component: GameDetailComponent },
  { path: '**', redirectTo: 'games' }
];
