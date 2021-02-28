import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AudioService } from '../../services/audio.service';
import { GameDataService } from '../../services/game-data.service';
import { getGameData, setGameData } from '../../services/game-storage.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {

  splashProgress: number;
  categoryData: any;
  categoryId: any;
  completeLevelData: any;
  musicEnabled: boolean;
  audioEnabled: boolean;
  jsonUrl: any;

  constructor(private router: Router, private audio: AudioService, private gameData: GameDataService) { }

  async ngOnInit() {
    this.splashProgress = 0.1;
    this.preloadAudio('game-bgm-challenge', '/assets/music/game-bg.ogg');
    
    this.jsonUrl = await this.gameData.getGameData('levelJsonData');
    this.splashProgress = 0.5;

    await this.gameData.getGameInfo(this.jsonUrl, 'currentQuestionsData');
    this.splashProgress = 0.8;

    setTimeout(()=> {
      this.router.navigate(['/game']);
    }, 1000);

  }

  preloadAudio(key: string, file: string) {
    this.audio.preload(key, file);
    this.splashProgress = this.splashProgress + 0.025
  }

}
