import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'witzy-menu-background',
  template: `
    <ng-lottie [options]="options" class="background"></ng-lottie>
  `,
  styleUrls: ['./menu-background.component.scss'],
})

export class MenuBackgroundComponent implements CommonModule {
  options: AnimationOptions = {
    path: '/assets/bodymovin/space-bg.json',
  };
}
