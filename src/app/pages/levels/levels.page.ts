import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, animate, style } from '@angular/animations'

import { Platform, NavController } from '@ionic/angular';

import { GameDataService } from '../../services/game-data.service';
import { getGameData } from '../../services/game-storage.service';
import { AudioService } from '../../services/audio.service';

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

  async ngOnInit() {
    this.buttonClass = ""
    this.categoryName = await this.gameData.getPersistentGameData('currentCategoryName');
    this.categoryId = await this.gameData.getPersistentGameData('currentCategoryId');
    this.levels = await this.gameData.getPersistentGameData("currentLevelData_"+this.categoryId);
    this.audioEnabled = await getGameData("game_audio")
    this.musicEnabled = await getGameData("game_music")

    this.modalVisible = false;
    this.modalWindowRoll = false;
  }

  setCurrentLevelData(index) {
    this.gameData.setPersistentGameData('currentLevelId', index.categoryName);
    this.gameData.setGameData('currentLevelNumber', this.levelNumber);
    this.gameData.setGameData('currentLevelNumberTrue', this.levelNumberShow);
    this.gameData.setGameData('currentCategoryId', this.categoryId)
    this.gameData.setPersistentGameData('currentCategory', this.categoryId);

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
        }, 400);
      }, 300);
    }, 400);
  }

  onClickPlayButton(){
    if (this.audioEnabled) {
      this.audio.playSfx('game-sfx-select');
    }
    this.modalWindowRoll = false;
    this.modalVisible = false;
    this.audio.stopBgm('game-bgm-current-category-'+this.categoryId);
    this.audio.unloadBgm('game-bgm-current-category-'+this.categoryId);
    this.router.navigate(['/loading']);
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

  ionViewWillEnter() {
    this.inputEnabled = true;

    setTimeout(()=> {
      this.buttonClass = "bounceIn";
    }, 400);

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      this.navCtrl.navigateBack(['/categories']);
    });
  }

  ionViewWillLeave() {
    if (this.router.url == "/categories") {
      if (this.audioEnabled) {
        this.audio.playSfx('game-sfx-back');
      }

      setTimeout(()=> {
        this.buttonClass = "";
      }, 1000);

      if (this.musicEnabled) {
        this.audio.stopBgm('game-bgm-current-category-'+this.categoryId);
        this.audio.unloadBgm('game-bgm-current-category-'+this.categoryId);
        this.audio.playBgm('game-bgm-main-menu');
      }
    }
  }
}
