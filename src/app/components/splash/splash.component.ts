import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loader',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})

export class SplashComponent implements OnInit {
  public progress: number = 0.0
  public progressDots: number = 0.0
  loadTime = 0

  constructor(private router: Router) { }

  public addProgress(newProgress: number, progessTime: number, newActivity: string) {
    setTimeout(()=> {
      this.progress = newProgress;
      this.progressDots = newProgress;

      if (newProgress == 1) {
        setTimeout(()=> {
          this.router.navigate([newActivity]);
        }, progessTime);
      }
      
    }, progessTime);
  };

  public goToActivity(newActivity: string, progessTime: number) {
    setTimeout(()=> {
      this.progress = 1.0;
      this.router.navigate([newActivity]);
    }, progessTime);
  };

  ngOnInit() {
    this.addProgress(0.1, 1000, '/home');
    this.addProgress(0.5, 3000, '/home');
    this.addProgress(0.8, 5000, '/home');
    this.addProgress(1.0, 5000, '/home');
  }

}
