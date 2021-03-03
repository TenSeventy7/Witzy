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
  musicEnabled: any;
  audioEnabled: any;
  musicPlaying: string;

  async ngOnInit() {
    this.audioEnabled = await getGameData("game_audio")
    this.musicEnabled = await getGameData("game_music")
    this.musicPlaying = this.gameData.getGameData("mainBgmPlaying")

    if (this.musicEnabled && this.musicPlaying == 'stopped') {
      this.gameData.setGameData('mainBgmPlaying', 'playing')
      this.audio.playBgm('game-bgm-main-menu');
    } 
  }

  async alertExit() {
    if (this.audioEnabled) {
      this.audio.playSfx('game-sfx-confirm');
    }

    const alert = await this.alertController.create({
      header: 'Exit Witzy',
      message: 'Are you sure you want to exit?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            if (this.musicEnabled) {
              this.audio.stopBgm('game-bgm-main-menu');
            }

            App.exitApp();
          }
        }, {
          text: 'No',
          role: 'cancel',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
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

  goAbout() {
    if (this.audioEnabled) {
      this.audio.playSfx('game-sfx-select');
    }

    this.router.navigate(['/about']);
  }

  toggleMusic() {
    if (this.musicEnabled) {
      this.musicEnabled = false;
      this.audio.setBgmState(false);
      this.audio.stopBgm('game-bgm-main-menu');
      this.gameData.setGameData('mainBgmPlaying', 'playing')
    } else {
      this.musicEnabled = true;
      this.audio.setBgmState(true);
      this.audio.playBgm('game-bgm-main-menu');
      this.gameData.setGameData('mainBgmPlaying', 'stopped')
    }
  }

  toggleAudio() {
    if (this.audioEnabled) {
      this.audioEnabled = false;
      this.audio.setSfxState(false);
    } else {
      this.audioEnabled = true;
      this.audio.setSfxState(true);
      this.audio.playSfx('game-sfx-select');
    }
  }

  ionViewWillEnter() {
    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      this.alertExit();
    });
  }
}
