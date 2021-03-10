import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, animate, style } from '@angular/animations'

import { Platform, NavController } from '@ionic/angular';

import { GameDataService } from '../../services/game-data.service';
import { getGameData } from '../../services/game-storage.service';
import { AudioService } from '../../services/audio.service';
import 'vanilla-tilt';

declare var VanillaTilt;

@Component({
  selector: 'app-levels',
  templateUrl: './levels.page.html',
  styleUrls: ['./levels.page.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(120%)'}),
        animate('400ms ease', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('400ms ease', style({transform: 'translateY(120%)'}))
      ])
    ])
  ],
})

export class LevelsPage implements OnInit {
  jsonUrl: string;
  levels: any;
  recievedLevels: any;

  categoryName: any;
  categoryId: any;
  
  levelNumber: string;
  levelNumberShow: number;
  levelScore: any;

  modalVisible: boolean = false;
  inputEnabled: boolean = true;
  selectedLevel: any;

  musicEnabled: any;
  audioEnabled: any;

  levelRemark: string;
  levelDescription: string;
  buttonClass: string;

  modalFade: string;
  modalWindowRoll: boolean = false;
  earnedStars: number;
  currentLevelNumber: any;
  modalShow: string;

  constructor(private navCtrl: NavController, private router: Router, private platform: Platform, private audio: AudioService, private gameData: GameDataService) { }

  ngOnInit() {
    this.buttonClass = ""
    this.categoryId = this.gameData.getGameData('currentCategoryId');
    this.categoryName = this.gameData.getGameData('currentCategoryName');
    this.levels = this.gameData.getGameData("currentLevelData_"+this.categoryId);
  }

  setCurrentLevelData(index) {
    this.gameData.setPersistentGameData('currentLevelId', index.categoryName);
    this.gameData.setGameData('currentLevelNumber', this.levelNumber);
    this.gameData.setGameData('currentLevelNumberTrue', this.levelNumberShow);

    this.levelRemark = index.levelRemark;
    this.levelDescription = index.levelDesc;
  }

  showLevelModal(index) {
    if (this.audioEnabled) {
      this.audio.playSfx('game-sfx-alert');
    }

    this.modalVisible = true;
    this.inputEnabled = false;

    setTimeout(()=> {
      this.modalFade = "fadeIn";
      setTimeout(()=> {
        this.modalWindowRoll = true;
        setTimeout(()=> {
          this.inputEnabled = true;
          this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
            this.onClickOutsideModal();
          });
        }, 400);
      }, 400);
    }, 300);
  }

  onClickOutsideModal() {
    this.modalWindowRoll = false;
    this.inputEnabled = false;

    if (this.audioEnabled) {
      this.audio.playSfx('game-sfx-back');
    }

    setTimeout(()=> {
      this.modalFade = "fadeOut"
      setTimeout(()=> {
        this.modalVisible = false;

        setTimeout(()=> {
          this.inputEnabled = true;

          this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
            this.navCtrl.navigateBack(['/categories'], { animated: true });
          });
        }, 400);
      }, 300);
    }, 400);
  }

  onClickPlayButton(){
    this.modalWindowRoll = false;
    this.inputEnabled = false;

    if (this.audioEnabled) {
      this.audio.playSfx('game-sfx-select');
    }
    
    if (this.musicEnabled) {
      this.audio.stopBgm("game-bgm-current-category-"+this.categoryId);
    }

    setTimeout(()=> {
      this.modalFade = "fadeOut"
      setTimeout(()=> {
        this.modalVisible = false;
        this.navCtrl.navigateRoot(['/loading'], { animated: true, animationDirection: 'forward' });
      }, 300);
    }, 400);
  }

  async onClickLevel(levelIndex: number) {
    this.selectedLevel = this.levels[levelIndex];
    this.gameData.setGameData('levelJsonData', this.levels[levelIndex].levelUrl);
    this.earnedStars = this.levels[levelIndex].starsObtained;
    this.levelNumber = levelIndex.toString();
    this.levelNumberShow = levelIndex + 1;
    this.levelScore = await this.gameData.getScoreInfo(this.categoryId, this.levelNumber);

    if (this.levelScore) {
      this.modalShow = "score"
    } else {
      this.modalShow = "desc"
    }

    this.setCurrentLevelData(this.selectedLevel);
    this.showLevelModal(this.selectedLevel);
  }

  async ionViewWillEnter() {
    this.inputEnabled = true;
    this.audioEnabled = await getGameData("game_audio")
    this.musicEnabled = await getGameData("game_music")
    this.buttonClass = ""
    this.modalVisible = false;
    this.modalWindowRoll = false;

    VanillaTilt.init(document.querySelector(".background-layers"), { max: 15, gyroscope: true, glare: true, "max-glare": 0.3, reverse: true, reset: true, perspective: 1500 });
    VanillaTilt.init(document.querySelectorAll(".background-layers"));
  }

  ionViewDidEnter() {
    setTimeout(()=> {
      this.buttonClass = "bounceIn";
    }, 400);

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      this.navCtrl.navigateBack(['/categories'], { animated: true });
    });
  }

  ionViewWillLeave() {
    if (this.router.url == "/categories") {
      if (this.audioEnabled) {
        this.audio.playSfx('game-sfx-back');
      }

      if (this.musicEnabled) {
        this.audio.stopBgm('game-bgm-current-category-'+this.categoryId);
        this.audio.playBgm('game-bgm-main-menu');
      }
    }
  }

  async ionViewDidLeave() {
    this.modalWindowRoll = false;
    this.modalVisible = false;
    
    if (this.router.url == "/categories") {

      setTimeout(()=> {
        this.buttonClass = "";
      }, 1000);
    }
  }
}
