import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResultsPageRoutingModule } from './results-routing.module';
import { NgxTypedJsModule } from 'ngx-typed-js';

import { ResultsPage } from './results.page';
import { HeaderComponentModule } from '../../components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxTypedJsModule,
    HeaderComponentModule,
    ResultsPageRoutingModule
  ],
  declarations: [ResultsPage]
})
export class ResultsPageModule {}
