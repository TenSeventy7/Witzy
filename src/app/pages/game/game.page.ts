import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { trigger, transition, animate, style } from '@angular/animations'

import { Platform, AlertController } from '@ionic/angular';

import { NgxTypedJsComponent } from 'ngx-typed-js';
import { AudioService } from '../../services/audio.service';
import { GameDataService } from '../../services/game-data.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
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

export class GamePage implements OnInit {
  @ViewChild(NgxTypedJsComponent) typed: NgxTypedJsComponent;
  
  correctSfxArray = [
    'game-sfx-correct_1',
    'game-sfx-correct_2',
    'game-sfx-correct_1',
    'game-sfx-correct_2',
    'game-sfx-correct_1',
    'game-sfx-correct_2',
    'game-sfx-correct_1',
    'game-sfx-correct_2',
    'game-sfx-correct_1',
    'game-sfx-correct_2'
  ];
  
  incorrectSfxArray = [
    'game-sfx-wrong_1',
    'game-sfx-wrong_2',
    'game-sfx-wrong_1',
    'game-sfx-wrong_2',
    'game-sfx-wrong_1',
    'game-sfx-wrong_2',
    'game-sfx-wrong_1',
    'game-sfx-wrong_2',
    'game-sfx-wrong_1',
    'game-sfx-wrong_2'
  ];

  randomAudioSelection: number;

  slideOptions = {
    slidesPerView: 1,
    loop: false,
    centeredSlides: true,
    centeredSlidesBounds: true,
    preventInteractionOnTransition: true
  };

  questionIndex = 0;
  answerButtons: boolean;
  hintText: string;

  currentLevel: any;
  currentLevelTrue: any;
  currentCategory: any;
  recievedquestionData = this.scoreData.getGameData('currentQuestionsData');

  // Score
  currentScore: number = 0;
  questionScore: number = 0;
  totalPossibleScore: number = 0;
  cuurentScoreAnimate: boolean = false;

  multiplierScore: number;
  actualScore: number;

  // Stars
  roundStars: number = 0;
  roundStar1Requirement: number = 0;
  roundStar2Requirement: number = 0;
  roundStar3Requirement: number = 0;

  userAnswer: any;
  questionResponseClass: any;

  id: number = 0
  questionData: any

  timeLeft: number = 10;
  interval: any;

  // Typed.js
  typedJs: boolean = true

  // Modal
  modalFade: string;
  userInputOk: boolean = true;
  inputEnabled: boolean = true;
  modalVisible: boolean = false;
  modalWindowRoll: boolean = false;

  constructor(private navCtrl: NavController, private router: Router, private platform: Platform, private audio: AudioService, public alertController: AlertController, private scoreData: GameDataService) {}

  async ngOnInit() {
    let slides = document.querySelector('ion-slides');

    this.currentCategory = this.scoreData.getGameData('currentCategoryId');
    this.currentLevel = this.scoreData.getGameData('currentLevelNumber');
    this.currentLevelTrue = (this.scoreData.getGameData('currentLevelNumberTrue')).toString();
    this.roundStar1Requirement = this.scoreData.getGameData('roundStar1Requirement')
    this.roundStar2Requirement = this.scoreData.getGameData('roundStar2Requirement')
    this.roundStar3Requirement = this.scoreData.getGameData('roundStar3Requirement')

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      console.log('Handler was called!');
      this.showGameModal();
    });

    this.questionData = this.scoreData.getGameData('currentQuestionsData').questions
    console.log(this.scoreData.getGameData('currentQuestionsData').questions)
    this.questionResponseClass = "normal"
    this.randomizeAnswerArray()
    slides.options = this.slideOptions;
    slides.lockSwipes(true);

    this.answerButtons = true;

    this.startTimer();

    this.audio.playBgm("game-bgm-level-screen");
    this.hintText = this.questionData[this.questionIndex].hintText;
  }

  showGameModal() {
    if (this.userInputOk) {
      this.modalVisible = true;
      this.inputEnabled = false;

      clearInterval(this.interval);

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

          this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
            this.showGameModal();
          });

          this.startTimer();
        }, 400);
      }, 300);
    }, 400);
  }

  async presentAlertMultipleButtons() {
    const alert = await this.alertController.create({
      header: 'Exit Level '+this.currentLevelTrue,
      message: 'Are you sure you want to exit?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.navCtrl.navigateBack(['/exit']);
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

  onClickPlayButton(){
    this.router.navigate(['/game']);
  }

  startTimer() {
      this.interval = setInterval(() => {
        if(this.timeLeft > 1) {
          this.timeLeft--;
        } else {
          this.timeLeft = 0;
          this.questionResponseClass = "incorrect"
          this.questionResponse()
        }
      },1000)
  }

  checkStarScore() {
    // Check if the current score matches our star requirements
    if (this.currentScore >= this.roundStar1Requirement) {
      this.roundStars = 1;
    }

    if (this.currentScore >= this.roundStar2Requirement) {
      this.roundStars = 2;
    }
    
    if (this.currentScore >= this.roundStar3Requirement) {
      this.roundStars = 3;
    }
  }

  checkUserAnswer(index: number) {
    // Set current question index
    this.questionScore = this.questionData[this.questionIndex].questionScore
    if ( this.timeLeft > 5 ) {
      this.multiplierScore = this.questionScore / 10
    } else {  
      this.multiplierScore = this.questionScore / 8
    }

    this.actualScore = Math.round(this.multiplierScore * this.timeLeft)

    this.userAnswer = this.questionData[this.questionIndex].answers[index]
    
    // Check if the answer user selected is correct
    if (this.id > -1) {
      if (this.userAnswer.correct) {
          this.currentScore = this.currentScore + this.actualScore;
          this.checkStarScore(); // Check if the current score matches our star requirements
          this.questionResponseClass = "correct"
          this.cuurentScoreAnimate = true;
          this.questionResponse()
      }
      else {
          this.questionResponseClass = "incorrect"
          this.questionResponse()
      }
    }
  }

  questionResponse() {
    this.answerButtons = false;
    this.typedJs = false;
    this.userInputOk = false;
    clearInterval(this.interval);
    this.randomAudioSelection = Math.floor(Math.random()*this.correctSfxArray.length);

    if ( this.questionResponseClass == "incorrect" ) {
      this.audio.playSfx(this.incorrectSfxArray[this.randomAudioSelection]);
    } else {
      this.audio.playSfx(this.correctSfxArray[this.randomAudioSelection]);
    }

    setTimeout(()=> {
      this.hintText = this.questionData[this.questionIndex].solutionText;
      this.typedJs = true;

      setTimeout(()=> {
        this.presentNextQuestion();
      }, 4000);
    }, 300);
  }

  presentNextQuestion() {
    this.cuurentScoreAnimate = false;

    if (this.questionIndex >= this.questionData.length - 1) {
      this.questionIndex = 0

      this.audio.stopBgm("game-bgm-level-screen");
      this.scoreData.setScoreInfo(this.currentCategory, this.currentLevel, this.currentScore)
      this.scoreData.setStarInfo(this.currentCategory, this.currentLevel, this.roundStars)

      this.scoreData.setGameData('currentGameScore', this.currentScore);
      this.scoreData.setGameData('currentGameStars', this.roundStars);
      this.router.navigate(['/results']);
    }
    else {
      let slides = document.querySelector('ion-slides');
      // Else, present new question
      this.questionIndex = this.questionIndex + 1;
      slides.lockSwipes(false);
      this.typedJs = false;
      
      this.randomizeAnswerArray();

      setTimeout(()=> {
        slides.slideNext(350);
        slides.lockSwipes(true);
      }, 350);

      this.questionResponseClass = "normal"
      this.hintText = this.questionData[this.questionIndex].hintText

      setTimeout(()=> {
        this.answerButtons = true;
        this.userInputOk = true;
        this.typedJs = true;
        this.timeLeft = 10;
        this.startTimer();
      }, 500);
    }
  }

  randomizeAnswerArray() {
    var shuffleArray = function(array) {
      var m = array.length, t, i;
    
      // While there remain elements to shuffle
      while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
    
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }
    
      return array;
    }

    this.questionData[this.questionIndex].answers = shuffleArray(this.questionData[this.questionIndex].answers)
  }
}
