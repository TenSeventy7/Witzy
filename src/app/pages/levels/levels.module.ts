import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LevelsPageRoutingModule } from './levels-routing.module';
import { LevelsPage } from './levels.page';

import { HeaderComponentModule } from '../../components/header/header.module';
import { MenuBackgroundComponentModule } from '../../components/menu-background/menu-background.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuBackgroundComponentModule,
    HeaderComponentModule,
    LevelsPageRoutingModule
  ],
  declarations: [LevelsPage]
})
export class LevelsPageModule {}
