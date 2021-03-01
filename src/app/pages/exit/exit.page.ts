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
  recievedcategoryData: any;
  musicEnabled: boolean;
  audioEnabled: boolean;
  jsonUrl: any;

  constructor(private navCtrl: NavController, private audio: AudioService, private gameData: GameDataService) { }

  async ngOnInit() {
    this.splashProgress = 0.1;
    
    this.recievedcategoryData = await this.gameData.getGameData('categoryData');
    this.categoryData =  this.recievedcategoryData.categories;
    this.splashProgress = 0.5;

    for (var index = 0; index < this.categoryData.length; index++) {
      this.categoryId = this.categoryData[index].categoryId;
      await this.gameData.getGameInfo(this.categoryData[index].jsonUrl, "currentLevelData_"+this.categoryId);
      this.completeLevelData = await this.gameData.getUnlockedLevels(this.categoryId);
      this.gameData.setGameData("currentLevelData_"+this.categoryId, this.completeLevelData);
      this.splashProgress = this.splashProgress + 0.05
    }

    setTimeout(()=> {
      this.navCtrl.navigateBack(['/levels']);
    }, 1000);
  }

  preloadAudio(key: string, file: string) {
    this.audio.preload(key, file);
    this.splashProgress = this.splashProgress + 0.025
  }

}
