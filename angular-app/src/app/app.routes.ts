import { Routes } from '@angular/router';
import { GameListComponent } from './components/game-list/game-list';
import { GameDetailComponent } from './components/game-detail/game-detail';
import { AddGameFormComponent } from './components/add-game-form/add-game-form';

export const routes: Routes = [
  { path: '', redirectTo: 'games', pathMatch: 'full' },
  { path: 'games', component: GameListComponent },
  { path: 'games/add', component: AddGameFormComponent },
  { path: 'games/:id', component: GameDetailComponent },
  { path: '**', redirectTo: 'games' }
];
