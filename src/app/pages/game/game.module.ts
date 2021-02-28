import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GamePageRoutingModule } from './game-routing.module';
import { HeaderComponentModule } from '../../components/header/header.module';
import { NgxTypedJsModule } from 'ngx-typed-js';

import { GamePage } from './game.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderComponentModule,
    NgxTypedJsModule,
    GamePageRoutingModule
  ],
  declarations: [GamePage]
})
export class GamePageModule {}
