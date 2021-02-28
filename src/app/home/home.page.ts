import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameDataService } from '../services/game-data.service';
import { AudioService } from '../services/audio.service';
import { Platform, AlertController } from '@ionic/angular';
import { getGameData } from '../services/game-storage.service';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router, private platform: Platform,  private audio: AudioService, public alertController: AlertController, private gameData: GameDataService) {}

  categoryData: any[] = [];
  musicEnabled: boolean = true;
  audioEnabled: boolean = true;

  async ngOnInit() {
    this.musicEnabled = await getGameData("game_music");
    this.audioEnabled = await getGameData("game_audio");

    if (this.musicEnabled) {
      this.audio.playBgm('game-bgm-main-menu');
      this.audio.setBgmVolume('game-bgm-main-menu', 0.6);
    }

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      console.log('Handler was called!');
      this.presentAlertMultipleButtons();
    });
    
  }

  async presentAlertMultipleButtons() {
    const alert = await this.alertController.create({
      header: 'Exit Level',
      message: 'Are you sure you want to exit?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'OK',
          handler: () => {
            App.exitApp();
          }
        }
      ]
    });

    await alert.present();
  }

  goCategories() {
    if (this.audioEnabled) {
      this.audio.playSfx('game-sfx-select');
    }

    this.router.navigate(['/categories']);
  }

  async toggleMusic() {
    if (this.musicEnabled) {
      this.musicEnabled = false;
      this.audio.setBgmState(false);
      this.audio.stopBgm('game-bgm-main-menu');
    } else {
      this.musicEnabled = true;
      this.audio.setBgmState(true);
      this.audio.playBgm('game-bgm-main-menu');
      this.audio.setBgmVolume('game-bgm-main-menu', 0.6);
    }
  }

  async toggleAudio() {
    if (this.audioEnabled) {
      this.audioEnabled = false;
      this.audio.setSfxState(false);
    } else {
      this.audioEnabled = true;
      this.audio.setSfxState(true);
      this.audio.playSfx('game-sfx-select');
    }
  }
}
