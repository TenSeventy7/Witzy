import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'witzy-menu-background',
  template: `
    <ng-lottie [options]="options" (animationCreated)="animationCreated($event)" class="background"></ng-lottie>
    <ng-lottie [options]="spaceOptions" (animationCreated)="animationCreated($event)" class="background-spaceman"></ng-lottie>
  `,
  styleUrls: ['./menu-background.component.scss'],
})

export class MenuBackgroundComponent implements CommonModule {
  options: AnimationOptions = {
    path: '/assets/bodymovin/space-bg.json',
  };

  spaceOptions: AnimationOptions = {
    path: '/assets/bodymovin/spaceman.json',
  };
 
  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }
}
