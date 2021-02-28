import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GameDataResolverService } from './resolvers/game-data-resolver.service';

const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
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
    path: 'splash',
    loadChildren: () => import('./pages/splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then( m => m.CategoriesPageModule)
  },
  {
    path: 'levels',
    loadChildren: () => import('./pages/levels/levels.module').then( m => m.LevelsPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'loading',
    loadChildren: () => import('./pages/loading/loading.module').then( m => m.LoadingPageModule)
  },
  {
    path: 'exit',
    loadChildren: () => import('./pages/exit/exit.module').then( m => m.ExitPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
