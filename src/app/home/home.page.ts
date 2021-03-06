import { Component, OnInit } from '@angular/core';
import { GameDataService } from '../services/game-data.service';
import { AudioService } from '../services/audio.service';
import { Platform, NavController, AlertController } from '@ionic/angular';
import { getGameData } from '../services/game-storage.service';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private navCtrl: NavController, private platform: Platform,  private audio: AudioService, public alertController: AlertController, private gameData: GameDataService) {}

  musicEnabled: any;
  audioEnabled: any;
  musicPlaying: string;

  ngOnInit() {
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
            if (this.audioEnabled) {
              this.audio.playSfx('game-sfx-back');
            }

            if (this.musicEnabled) {
              this.audio.stopBgm('game-bgm-main-menu');
            }

            App.exitApp();
          }
        }, {
          text: 'No',
          role: 'cancel',
          handler: (blah) => {
            if (this.audioEnabled) {
              this.audio.playSfx('game-sfx-back');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async goCategories() {
    if (this.audioEnabled) {
      this.audio.playSfx('game-sfx-select');
    }

    this.navCtrl.navigateForward(['/categories'], { animated: true });
  }

  async goAbout() {
    if (this.audioEnabled) {
      this.audio.playSfx('game-sfx-select');
    }

    this.navCtrl.navigateForward(['/about'], { animated: true });
  }

  toggleMusic() {
    if (this.musicEnabled) {
      this.musicEnabled = false;
      this.audio.setBgmState(false);
      this.audio.stopBgm('game-bgm-main-menu');
    } else {
      this.musicEnabled = true;
      this.audio.setBgmState(true);
      this.audio.playBgm('game-bgm-main-menu');
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

  async ionViewWillEnter() {
    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      this.alertExit();
    });

    this.audioEnabled = await getGameData("game_audio")
    this.musicEnabled = await getGameData("game_music")
  }
}
