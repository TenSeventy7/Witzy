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

  async ngOnInit() {
    this.categoriesData = await this.gameData.getPersistentGameData('categoryData');
    this.categories = this.categoriesData.categories;
    this.audioEnabled = await getGameData("game_audio")
    this.musicEnabled = await getGameData("game_music")

    setTimeout(()=> {
      this.buttonClass = "category-buttons-in";
    }, 1000);
  }

  goCategory(url) {
    if (url.isAvailable) {
      if (this.musicEnabled) {
        this.audio.stopBgm('game-bgm-main-menu');
        this.gameData.setGameData('mainBgmPlaying', 'stopped')
        this.audio.playBgm('game-bgm-current-category-'+this.categoryId);
      }

      this.router.navigate(['/levels']);
    }
  }

  setCurrentCategoryData(name) {
    this.gameData.setPersistentGameData('currentCategoryName', name.categoryName);
    this.gameData.setGameData('currentCategoryId', name.categoryId);
  }

  async onClickCategory(index: number) {
    this.selectedCategory = this.categories[index];
    await this.setCurrentCategoryData(this.selectedCategory);
    this.categoryId = this.gameData.getGameData('currentCategoryId')
    this.goCategory(this.selectedCategory);
  }

  ionViewWillEnter() {
    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      this.navCtrl.navigateBack(['/home']);
    });
  }

  ionViewWillLeave() {
    if (this.router.url == "/home") {
      if (this.audioEnabled) {
        this.audio.playSfx('game-sfx-back');
      }
    }
  }
}
