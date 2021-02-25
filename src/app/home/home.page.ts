import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GameDataService } from '../services/game-data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router, private http: HttpClient, private gameData: GameDataService) {}

  categoryData: any[] = [];

  goCategories() {
    this.http.get('/assets/categories/categories.json', {responseType: 'json'}).subscribe(
      (data) => {
      console.log(data);
      this.gameData.setGameData('categoryData', data);
      this.router.navigate(['/categories']);
      });
  }
}
