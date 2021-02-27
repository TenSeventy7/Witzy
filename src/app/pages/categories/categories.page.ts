import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GameDataService } from '../../services/game-data.service';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})

export class CategoriesPage implements OnInit {

  showCategoryCards: boolean;
  selectedCategory: string;
  categories: Array<string> = this.gameData.getGameData('categoryData').categories;

  constructor(private router: Router, private http: HttpClient, private gameData: GameDataService) { }

  ngOnInit() {
    let categories: Array<string> = this.gameData.getGameData('categoryData').categories;
    console.log(this.categories);
  }

  goCategory(url) {
    if (url.isAvailable) {
      this.http.get(url.jsonUrl, {responseType: 'json'}).subscribe(
        (data) => {
        console.log(data);
        this.gameData.setGameData('currentLevelData', data);
        this.router.navigate(['/levels']);
      });
    }
  }

  setCurrentCategoryData(name) {
    this.gameData.setGameData('currentCategoryName', name.categoryName);
    this.gameData.setGameData('currentCategoryId', name.categoryId);
  }

  onClickCategory(index: number) {
    this.selectedCategory = this.categories[index];
    this.setCurrentCategoryData(this.selectedCategory);
    this.goCategory(this.selectedCategory);
  }
}
