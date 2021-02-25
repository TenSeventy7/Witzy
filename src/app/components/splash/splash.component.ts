import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})

export class SplashComponent implements OnInit {
  @Input() progress: number;

  constructor() {}

  ngOnInit() {
  }

}
