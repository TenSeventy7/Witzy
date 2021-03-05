import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameDataService } from '../../services/game-data.service';
import { NavController, Platform } from '@ionic/angular';
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
  selectedCategoryMusic: any;
  buttonClass: string;
  audioEnabled: any;
  musicEnabled: any;
  categoriesData: any;
  categoryId: any;
  categories: Array<string>;

  constructor(private navCtrl: NavController, private platform: Platform, private router: Router, private gameData: GameDataService, private audio: AudioService) { }

  ngOnInit() {
  }

  goCategory(url) {
    if (url.isAvailable) {
      this.navCtrl.navigateRoot(['/levels'], { animated: true, animationDirection: 'forward' });
    }
  }

  setCurrentCategoryData(name) {
    this.gameData.setPersistentGameData('currentCategoryName', name.categoryName);
    this.gameData.setGameData('currentCategoryId', name.categoryId);
  }

  onClickCategory(index: number) {
    this.selectedCategory = this.categories[index];
    this.setCurrentCategoryData(this.selectedCategory);
    this.categoryId = this.gameData.getGameData('currentCategoryId')
    this.goCategory(this.selectedCategory);
  }

  async ionViewWillEnter() {
    this.categoriesData = await this.gameData.getPersistentGameData('categoryData');
    this.categories = this.categoriesData.categories;
    this.audioEnabled = await getGameData("game_audio")
    this.musicEnabled = await getGameData("game_music")

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      this.navCtrl.navigateBack(['/home']);
    });
  }

  async ionViewDidEnter() {
    setTimeout(()=> {
      this.buttonClass = "category-buttons-in";
    }, 500);
  }

  ionViewWillLeave() {
    if (this.router.url == "/home") {
      if (this.audioEnabled) {
        this.audio.playSfx('game-sfx-back');
      }
    }

    if (this.router.url == "/levels") {
      if (this.musicEnabled) {
        this.audio.stopBgm('game-bgm-main-menu');
        this.audio.playBgm('game-bgm-current-category-'+this.categoryId);
      }
    }
  }
}
