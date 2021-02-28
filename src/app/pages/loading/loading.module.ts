import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoadingPageRoutingModule } from './loading-routing.module';

import { LoadingPage } from './loading.page';
import { SplashComponentModule } from '../../components/splash/splash.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SplashComponentModule,
    LoadingPageRoutingModule
  ],
  declarations: [LoadingPage]
})
export class LoadingPageModule {}
