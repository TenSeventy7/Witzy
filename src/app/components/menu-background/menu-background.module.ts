import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuBackgroundComponent } from './menu-background.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule ],
  declarations: [MenuBackgroundComponent],
  exports: [MenuBackgroundComponent]
})
export class MenuBackgroundComponentModule {}
