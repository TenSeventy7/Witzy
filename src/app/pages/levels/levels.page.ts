import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { GameDataService } from '../../services/game-data.service';
import { trigger, transition, animate, style } from '@angular/animations'

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
  levels: Array<string> = this.gameData.getGameData('currentLevelData').levels;
  categoryName: string = this.gameData.getGameData('currentCategoryName');
  categoryId: string = this.gameData.getGameData('currentCategoryId');
  modalVisible: boolean = false;
  inputEnabled: boolean = true;
  levelNumber: number;
  selectedLevel: any;
  levelRemark: string;
  levelDescription: string;
  modalFade: string;
  modalWindowRoll: boolean = false;

  constructor(private router: Router, private platform: Platform, private http: HttpClient, private gameData: GameDataService) { }

  ngOnInit() {
    this.modalVisible = false;
    this.modalWindowRoll = false;
  }

  setCurrentLevelData(index) {
    this.gameData.setGameData('currentLevelId', index.categoryName);
    this.gameData.setGameData('currentLevelNumber', this.levelNumber);

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
            console.log('Handler was called!');
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
        setTimeout(()=> {
          this.inputEnabled = true;
        }, 400);
      }, 300);
    }, 400);
  }

  onClickPlayButton(){
    this.router.navigate(['/game']);
  }

  onClickLevel(levelIndex: number) {
    this.selectedLevel = this.levels[levelIndex];
    this.levelNumber = levelIndex + 1;
    this.setCurrentLevelData(this.selectedLevel);
    this.showLevelModal(this.selectedLevel);
  }

}
