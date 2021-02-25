import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  splashProgress: number;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.splashProgress = 0.5;

    this.http.get('/assets/bodymovin/space-bg.json', {responseType: 'json'}).subscribe(
      (data) => {
        this.http.get('/assets/bodymovin/spaceman.json', {responseType: 'json'}).subscribe(
          (bg) => {
          console.log(bg);
          console.log(data);
    
          setTimeout(()=> {
            this.splashProgress = 0.8;
          this.router.navigate(['/home']);
          }, 3000);
        });
    });
  }

}
