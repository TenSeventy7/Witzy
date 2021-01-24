import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GameDataResolverService } from './resolvers/game-data-resolver.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'results', loadChildren: () => import('./pages/results/results.module').then( m => m.ResultsPageModule)},
  { path: 'game', loadChildren: () => import('./pages/game/game.module').then( m => m.GamePageModule)},
  {
    path: 'results/:id',
    resolve: {
      currentGameScore: GameDataResolverService
    },
    loadChildren: './pages/results/results.module#ResultsPageModule'
  },
  {
    path: 'game',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
      },
      {
        path: ':id',
        loadChildren: () => import('./pages/game/game.module').then( m => m.GamePageModule)
      }
    ]
  },
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
