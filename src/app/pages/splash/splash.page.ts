import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../services/audio.service';
import { GameDataService } from '../../services/game-data.service';
import { getGameData, setGameData } from '../../services/game-storage.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  splashProgress: number;
  categoryData: any;
  categoryId: any;
  completeLevelData: any;
  receivedcategoryData: any;
  musicEnabled: boolean;
  audioEnabled: boolean;

  constructor(private router: Router, private audio: AudioService, private gameData: GameDataService) { }

  async ngOnInit() {
    this.splashProgress = 0.1;

    this.preloadAudio('game-bgm-main-menu', '/assets/music/game-bg.ogg');
    
    this.preloadAudio('game-sfx-correct_1', '/assets/ui/sounds/correct_1.ogg');
    this.preloadAudio('game-sfx-correct_2', '/assets/ui/sounds/correct_2.ogg');
    this.preloadAudio('game-sfx-wrong_1', '/assets/ui/sounds/wrong_1.ogg');
    this.preloadAudio('game-sfx-wrong_2', '/assets/ui/sounds/wrong_2.ogg');
    this.preloadAudio('game-sfx-alert', '/assets/ui/sounds/alert.ogg');
    this.preloadAudio('game-sfx-back', '/assets/ui/sounds/back.ogg');
    this.preloadAudio('game-sfx-click', '/assets/ui/sounds/click.ogg');
    this.preloadAudio('game-sfx-confirm', '/assets/ui/sounds/confirm.ogg');
    this.preloadAudio('game-sfx-drop', '/assets/ui/sounds/drop.ogg');
    this.preloadAudio('game-sfx-select', '/assets/ui/sounds/select.ogg');
    this.preloadAudio('game-sfx-toggle', '/assets/ui/sounds/toggle.ogg');

    await this.gameData.getGameInfo('/assets/categories/categories.json', 'categoryData');
    this.receivedcategoryData =  await this.gameData.getGameData('categoryData');
    this.categoryData =  this.receivedcategoryData.categories;

    this.musicEnabled = await getGameData("game_music");
    this.audioEnabled = await getGameData("game_audio");

    if (this.musicEnabled == null) {
      this.audio.setBgmState(true);
    }

    if (this.audioEnabled == null) {
      this.audio.setSfxState(true);
    }
    
    for (var index = 0; index < this.categoryData.length; index++) {
      this.categoryId = this.categoryData[index].categoryId;
      await this.gameData.getGameInfo(this.categoryData[index].jsonUrl, "currentLevelData_"+this.categoryId);
      this.completeLevelData = await this.gameData.getUnlockedLevels(this.categoryId);
      this.gameData.setGameData("currentLevelData_"+this.categoryId, this.completeLevelData);
      this.splashProgress = this.splashProgress + 0.05
    }

    this.splashProgress = 0.9;

    setTimeout(()=> {
      this.router.navigate(['/home']);
    }, 1000);
  }

  preloadAudio(key: string, file: string) {
    this.audio.preload(key, file);
    this.splashProgress = this.splashProgress + 0.025
  }
}
