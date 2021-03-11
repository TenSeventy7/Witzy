import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AboutPageRoutingModule } from './about-routing.module';

import { AboutPage } from './about.page';

import { HeaderComponentModule } from '../../components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderComponentModule,
    AboutPageRoutingModule
  ],
  declarations: [AboutPage]
})
export class AboutPageModule {}
