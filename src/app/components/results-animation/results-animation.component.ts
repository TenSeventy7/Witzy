import { Component, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-results-animation',
  templateUrl: './results-animation.component.html',
  styleUrls: ['./results-animation.component.scss'],
})
export class ResultsAnimationComponent implements OnInit {
  options: AnimationOptions = {
    path: '/assets/bodymovin/confetti.json'
  };

  constructor() { }

  ngOnInit() {}

}
