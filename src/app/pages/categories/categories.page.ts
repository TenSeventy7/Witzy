import { Component, OnInit } from '@angular/core';
import { GameDataService } from '../../services/game-data.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})

export class CategoriesPage implements OnInit {

  showCategoryCards: boolean;
  categories: Array<string> = this.gameData.getGameData('categoryData').categories;

  constructor(private gameData: GameDataService) { }

  ngOnInit() {
    let categories: Array<string> = this.gameData.getGameData('categoryData').categories;
    console.log(this.categories);
  }
}
