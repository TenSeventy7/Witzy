import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AudioService } from '../../services/audio.service';
import { GameDataService } from '../../services/game-data.service';
import { getGameData, setGameData } from '../../services/game-storage.service';

@Component({
  selector: 'app-exit',
  templateUrl: './exit.page.html',
  styleUrls: ['./exit.page.scss'],
})
export class ExitPage implements OnInit {

  splashProgress: number;
  categoryData: any;
  categoryId: any;
  completeLevelData: any;
  musicEnabled: boolean;
  audioEnabled: boolean;
  jsonUrl: any;

  constructor(private navCtrl: NavController, private audio: AudioService, private gameData: GameDataService) { }

  async ngOnInit() {
    this.splashProgress = 0.1;
    
    this.jsonUrl = await this.gameData.getGameData('levelJsonData');
    this.splashProgress = 0.5;

    await this.gameData.getGameInfo(this.jsonUrl, 'currentQuestionsData');
    this.splashProgress = 0.8;

    setTimeout(()=> {
      this.navCtrl.navigateBack(['/categories']);
    }, 1000);
  }

  preloadAudio(key: string, file: string) {
    this.audio.preload(key, file);
    this.splashProgress = this.splashProgress + 0.025
  }

}
