import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AudioService } from '../../services/audio.service';
import { getGameData } from '../../services/game-storage.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  audioEnabled: any;
  musicEnabled: any;

  constructor(private navCtrl: NavController, private platform: Platform, private router: Router, private audio: AudioService) { }

  ngOnInit() {
  }


  async ionViewWillEnter() {
    this.audioEnabled = await getGameData("game_audio")
    this.musicEnabled = await getGameData("game_music")

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
