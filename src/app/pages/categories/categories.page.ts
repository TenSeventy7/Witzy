import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GameDataService } from '../../services/game-data.service';
import { NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { AudioService } from '../../services/audio.service';
import { getGameData } from '../../services/game-storage.service';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})

export class CategoriesPage implements OnInit {

  showCategoryCards: boolean;
  selectedCategory: string;
  buttonClass: string;
  audioEnabled: boolean = true;
  categories: Array<string>;
  categoriesData: any;

  constructor(private navCtrl: NavController, private platform: Platform, private router: Router, private http: HttpClient, private gameData: GameDataService, private audio: AudioService) { }

  async ngOnInit() {
    this.categoriesData = await this.gameData.getGameData('categoryData');
    this.categories = this.categoriesData.categories;
    this.audioEnabled = await getGameData("game_audio");

    setTimeout(()=> {
      this.buttonClass = "category-buttons-in";
    }, 1000);

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      this.navCtrl.navigateBack(['/home']);
    });
  }

  goCategory(url) {
    if (url.isAvailable) {
      if (this.audioEnabled) {
        this.audio.playSfx('game-sfx-select');
      }

      this.router.navigate(['/levels']);
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
