import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuardGuard } from '../../services/auth-guard.guard';

const routes: Routes = [
  {
    path: 'tabs',
    redirectTo: 'tabs/games',
    pathMatch: 'full'
  },
  {
    
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'games',
        children: [
          {
            path: '',
            loadChildren: () => import('../games/games.module').then( m => m.GamesPageModule)
          }
        ]
      },
      {
        path: 'docs',
        children: [
          {
            path: '',
            loadChildren: () => import('../tab2/tab2.module').then( m => m.Tab2PageModule)
          }
        ]
      },
      {
        path: 'account',
        children: [
          {
            path: '',
            loadChildren: () => import('../tab3/tab3.module').then( m => m.Tab3PageModule)
          }
        ]
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule]
})
export class TabsPageRouterModule { }
