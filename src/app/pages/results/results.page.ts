import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { GameDataService } from '../../services/game-data.service';
import { AudioService } from '../../services/audio.service';
import { getGameData } from '../../services/game-storage.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit {
  remarksArray = [
    'You are amazing!',
    'I knew you can do it!',
    'Great job!',
    'Amazing job!',
    'Awesome!',
    'You are a champ!',
    'Learned something new?'
  ];

  dykArray = [
    'Did you know the moon has moonquakes? Yes, earthquakes occur there!',
    'Did you know that goosebumps in the body are meant to ward off predators?',
    'Did you know humans are the only animals that blush?',
    'Did you know a wood frog can hold its pee for up to eight months?',
    'Did you know your nostrils work one at a time?',
    'Did you know that a digestive system of a rabbit only goes one way?',
    'Did you know the cotton candy was invented by a dentist?',
    'Did you know that bees sometimes sting other bees?',
    'Did you know that water makes different pouring sounds depending on its temperature?',
    'Did you know that dogs actually understand some English?',
    'Did you know that koalas have fingerprints?',
    'Did you know that sea lions can dance to a beat? Really funky, I know.',
    'Did you know that some planets produce diamond rain?',
    'Did you know that sharks can live for 500 years?'
  ];

  gameResult: any = 1;
  gameStars: any = 0;
  gameLevel: any = 1;
  categoryId: any;
  newHighScore: string;
  hintText: string;
  remarkText: string;
  randomDykSelection: number;

  musicEnabled: any;
  audioEnabled: any;

  randomSelection: number;
  constructor(private platform: Platform, private navCtrl: NavController, private audio: AudioService, private scoreData: GameDataService) { }

  ngOnInit() {
    this.gameStars = this.scoreData.getGameData('currentGameStars');
    this.gameResult = (this.scoreData.getGameData('currentGameScore')).toString();
    this.newHighScore = this.scoreData.getGameData('newHighScore');
    this.gameLevel = (this.scoreData.getGameData('currentLevelNumberTrue')).toString();
    this.categoryId = this.scoreData.getGameData('currentCategoryId');
    this.randomSelection = Math.floor(Math.random()*this.remarksArray.length);
    this.remarkText = this.remarksArray[this.randomSelection];
    this.randomDykSelection = Math.floor(Math.random()*this.dykArray.length);
    this.hintText = this.dykArray[this.randomDykSelection];
  }

  onClickPlay() {
    if (this.audioEnabled) {
      this.audio.playSfx('game-sfx-select');
    }

    this.navCtrl.navigateRoot(['/loading'], { animated: false, animationDirection: 'back' });
  }

  onClickBack() {
    if (this.audioEnabled) {
      this.audio.playSfx('game-sfx-back');
    }

    this.navCtrl.navigateRoot(['/exit'], { animated: false, animationDirection: 'back' });
  }

  async ionViewWillEnter() {
    this.audioEnabled = await getGameData("game_audio")
    this.musicEnabled = await getGameData("game_music")

    if (this.audioEnabled) {
      this.audio.playSfx('game-sfx-results');
    }

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      this.onClickBack();
    });
  }
}
