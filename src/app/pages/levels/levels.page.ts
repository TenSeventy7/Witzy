import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { GameDataService } from '../../services/game-data.service';
import { NgxTypedJsComponent } from 'ngx-typed-js';
import { trigger, transition, animate, style } from '@angular/animations'
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
  @ViewChild(NgxTypedJsComponent) typed: NgxTypedJsComponent;

  jsonUrl: string;
  levels: any;
  unlockedLevels: any;
  selectedCategoryId: string = this.gameData.getGameData('currentCategoryId');
  categoryName: string = this.gameData.getGameData('currentCategoryName');
  categoryId: string = this.gameData.getGameData('currentCategoryId');
  modalVisible: boolean = false;
  inputEnabled: boolean = true;
  levelNumber: string;
  levelNumberShow: number;
  levelScore: any;
  selectedLevel: any;
  musicEnabled: boolean = true;
  audioEnabled: boolean = true;
  levelRemark: string;
  levelDescription: string;
  modalFade: string;
  modalWindowRoll: boolean = false;
  earnedStars: number;
  modalShow: string;

  levelEnabled: boolean = true;
  starRequirement: any;

  constructor(private navCtrl: NavController, private router: Router, private platform: Platform, private audio: AudioService, private http: HttpClient, private gameData: GameDataService) { }

  async ngOnInit() {
    this.levels = this.gameData.getGameData("currentLevelData_"+this.selectedCategoryId);
    this.audioEnabled = await getGameData("game_audio");
    this.musicEnabled = await getGameData("game_music");
    this.modalVisible = false;
    this.modalWindowRoll = false;
  }

  isLevelUnlocked(index) {
    console.log(this.unlockedLevels[index].disabled);
    return this.unlockedLevels[index].disabled;
  }

  setCurrentLevelData(index) {
    this.gameData.setGameData('currentLevelId', index.categoryName);
    this.gameData.setGameData('currentLevelNumber', this.levelNumber);
    this.gameData.setGameData('currentLevelNumberTrue', this.levelNumberShow);
    this.gameData.setGameData('currentCategory', this.categoryId);

    this.levelRemark = index.levelRemark;
    this.levelDescription = index.levelDesc;
  }

  showLevelModal(index) {
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

    setTimeout(()=> {
      this.modalFade = "fadeOut"
      setTimeout(()=> {
        this.modalVisible = false;

          this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
            this.navCtrl.navigateBack(['/categories']);
          });

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

    this.router.navigate(['/loading']);
  }

  async onClickLevel(levelIndex: number) {

    if (this.audioEnabled) {
        this.audio.playSfx('game-sfx-select');
    }

    this.selectedLevel = this.levels[levelIndex];

    this.gameData.setGameData('levelJsonData', this.levels[levelIndex].levelUrl);
    console.log(this.levels[levelIndex].levelUrl);

    this.earnedStars = this.levels[levelIndex].starsObtained;
    this.levelNumber = levelIndex.toString();
    this.levelNumberShow = levelIndex + 1;
    this.levelScore = await this.gameData.getScoreInfo(this.selectedCategoryId, this.levelNumber);

    if (this.levelScore) {
      this.modalShow = "score"
    } else {
      this.modalShow = "desc"
    }

    this.setCurrentLevelData(this.selectedLevel);
    this.showLevelModal(this.selectedLevel);
  }

}
