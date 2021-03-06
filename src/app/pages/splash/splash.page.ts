import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { AudioService } from '../../services/audio.service';
import { GameDataService } from '../../services/game-data.service';
import { getGameData } from '../../services/game-storage.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  splashProgress: number;
  categoryData: any;
  categoryId: any;
  categoryMusic: any;
  completeLevelData: any;
  receivedcategoryData: any;
  musicEnabled: boolean;
  audioEnabled: boolean;

  constructor(private navCtrl: NavController, private platform: Platform, private audio: AudioService, private gameData: GameDataService) { }

  ngOnInit() {
    this.splashProgress = 0.0;
  }

  preloadAudio(key: string, file: string) {
    this.audio.preload(key, file);
    this.splashProgress = this.splashProgress + 0.025
  }

  preloadBgm(key: string, file: string) {
    this.audio.preloadBgm(key, file);
    this.splashProgress = this.splashProgress + 0.025
  }

  async ionViewDidEnter() {
    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      console.log("Back disabled.")
    });

    this.musicEnabled = await getGameData("game_music")
    this.splashProgress = 0.1;

    this.preloadBgm('game-bgm-main-menu', '/assets/music/game_bgm_primary.ogg');    
    this.preloadAudio('game-sfx-correct_1', '/assets/ui/sounds/correct_1.ogg');
    this.preloadAudio('game-sfx-correct_2', '/assets/ui/sounds/correct_2.ogg');
    this.preloadAudio('game-sfx-wrong_1', '/assets/ui/sounds/wrong_1.ogg');
    this.preloadAudio('game-sfx-wrong_2', '/assets/ui/sounds/wrong_2.ogg');
    this.preloadAudio('game-sfx-alert', '/assets/ui/sounds/alert.ogg');
    this.preloadAudio('game-sfx-back', '/assets/ui/sounds/back.ogg');
    this.preloadAudio('game-sfx-results', '/assets/ui/sounds/results.ogg');
    this.preloadAudio('game-sfx-click', '/assets/ui/sounds/click.ogg');
    this.preloadAudio('game-sfx-start', '/assets/ui/sounds/start.ogg');
    this.preloadAudio('game-sfx-confirm', '/assets/ui/sounds/confirm.ogg');
    this.preloadAudio('game-sfx-drop', '/assets/ui/sounds/drop.ogg');
    this.preloadAudio('game-sfx-select', '/assets/ui/sounds/select.ogg');
    this.preloadAudio('game-sfx-toggle', '/assets/ui/sounds/toggle.ogg');

    await this.gameData.getGameInfo('/assets/categories/categories.json', 'categoryData', true);
    this.receivedcategoryData =  await this.gameData.getPersistentGameData('categoryData');
    
    this.categoryData =  this.receivedcategoryData.categories;

    if (await getGameData("game_music") == null || await getGameData("game_audio") == null ) {
      this.audio.setBgmState(true);
      this.audio.setSfxState(true);
    }
    
    for (var index = 0; index < this.categoryData.length; index++) {
      this.categoryId = this.categoryData[index].categoryId;
      this.categoryMusic = this.categoryData[index].musicUrl;
      await this.gameData.getGameInfo(this.categoryData[index].jsonUrl, "currentLevelData_"+this.categoryId, true);
      this.completeLevelData = await this.gameData.getUnlockedLevels(this.categoryId);
      this.preloadBgm('game-bgm-current-category-'+this.categoryId, this.categoryMusic);
      this.gameData.setGameData("currentLevelData_"+this.categoryId, this.completeLevelData);
      this.splashProgress = this.splashProgress + 0.05
    }

    this.splashProgress = 0.9;

    setTimeout(()=> {

      this.navCtrl.navigateRoot('/home', { animated: true, animationDirection: 'forward' });
    }, 1000);
  }

  ionViewWillLeave() {
    if (this.musicEnabled) {
      this.audio.playBgm('game-bgm-main-menu');
    }
  }

  ionViewDidLeave() {
    this.splashProgress = 0.0;
  }
}
