import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExitPageRoutingModule } from './exit-routing.module';

import { ExitPage } from './exit.page';
import { SplashComponentModule } from '../../components/splash/splash.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SplashComponentModule,
    ExitPageRoutingModule
  ],
  declarations: [ExitPage]
})
export class ExitPageModule {}
