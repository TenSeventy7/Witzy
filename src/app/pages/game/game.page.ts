import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { trigger, transition, animate, style } from '@angular/animations'

import { Platform, AlertController } from '@ionic/angular';

import { NgxTypedJsComponent } from 'ngx-typed-js';
import { AudioService } from '../../services/audio.service';
import { GameDataService } from '../../services/game-data.service';
import { getGameData } from '../../services/game-storage.service';

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

  currentLevel: number;
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
  countdownClass: any;

  id: number = 0
  questionData: any

  timeLeft: number = 10;
  countdown: number = 3;
  countdownInterval: any;
  isCountdown: boolean = false;
  isDone: boolean = false;
  interval: any;

  // Typed.js
  typedJs: boolean = true

  // Modal
  modalFade: string;
  userInputOk: boolean = true;
  inputEnabled: boolean = true;
  modalVisible: boolean = false;
  modalWindowRoll: boolean = false;
  oldScore: any;

  musicEnabled: any;
  audioEnabled: any;

  constructor(private navCtrl: NavController, private router: Router, private platform: Platform, private audio: AudioService, public alertController: AlertController, private scoreData: GameDataService) {}

  ngOnInit() {
    this.questionData = this.scoreData.getGameData('currentQuestionsData').questions
    this.currentCategory = this.scoreData.getGameData('currentCategoryId');
    this.currentLevel = this.scoreData.getGameData('currentLevelNumber');
    this.currentLevelTrue = (this.scoreData.getGameData('currentLevelNumberTrue')).toString();
    this.hintText = this.questionData[this.questionIndex].hintText;
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      if(this.countdown > 1) {
        this.countdownClass = "bounce"
        this.isDone = false;
        if (this.audioEnabled) {
          this.audio.playSfx('game-sfx-drop');
        }
        this.countdown--;
        setTimeout(()=> {
          this.countdownClass = "";
        }, 500);
      } else {
        if (this.audioEnabled) {
          this.audio.playSfx('game-sfx-start');
        }
        this.countdownClass = "bounce"
        this.isDone = true;
        clearInterval(this.countdownInterval);
        clearInterval(this.interval);
        this.startLevel()
      }
    },1000)
  }

  startLevel() {
    setTimeout(()=> {
      this.modalVisible = false;
      this.isCountdown = false;
      this.modalFade = "fadeOut";
  
      setTimeout(()=> {
        if (this.musicEnabled) {
          this.audio.playBgm("game-bgm-level-screen");
        }
        
        this.startTimer();
        this.typedJs = true;
        setTimeout(()=> {
          this.answerButtons = true;
          this.inputEnabled = true;
        }, 250);
      }, 300);
    }, 1000);
  }

  showGameModal() {
    if (this.userInputOk) {
      this.modalVisible = true;
      this.inputEnabled = false;

      if (this.audioEnabled) {
        this.audio.playSfx('game-sfx-alert');
      }

      if (this.musicEnabled) {
        this.audio.pauseBgm("game-bgm-level-screen");
      }

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

  async toggleMusic() {
    if (this.musicEnabled) {
      this.musicEnabled = false;
      this.audio.setBgmState(false);
    } else {
      this.musicEnabled = true;
      this.audio.setBgmState(true);
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

  onClickOutsideModal() {
    if (this.audioEnabled) {
      this.audio.playSfx('game-sfx-back');
    }

    if (this.musicEnabled) {
      this.audio.resumeBgm("game-bgm-level-screen");
    }

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

  async alertExitLevel() {
    if (this.audioEnabled) {
      this.audio.playSfx('game-sfx-confirm');
    }

    const alert = await this.alertController.create({
      header: 'Exit Level '+this.currentLevelTrue,
      message: 'Are you sure you want to exit?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.modalWindowRoll = false;
            this.inputEnabled = false;
            this.modalVisible = false;

            if (this.audioEnabled) {
              this.audio.playSfx('game-sfx-back');
            }

            alert.dismiss();

            setTimeout(()=> {
              this.navCtrl.navigateBack(['/exit']);
            }, 400);
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

    if (this.audioEnabled) {
      this.randomAudioSelection = Math.floor(Math.random()*this.correctSfxArray.length);
      if ( this.questionResponseClass == "incorrect" ) {
        this.audio.playSfx(this.incorrectSfxArray[this.randomAudioSelection]);
      } else {
        this.audio.playSfx(this.correctSfxArray[this.randomAudioSelection]);
      }
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
    
      if (this.currentScore > this.oldScore) {
        this.scoreData.setGameData('newHighScore', 'newHighScore');
      } else {
        this.scoreData.setGameData('newHighScore', 'noNewHighScore');
      }

      this.scoreData.setGameData('currentGameScore', this.currentScore);
      this.scoreData.setGameData('currentGameStars', this.roundStars);
      this.router.navigate(['/results']);
    }
    else {
      let slides = document.querySelector('ion-slides');
      // Else, present new question
      this.questionIndex = this.questionIndex + 1;
      slides.lockSwipes(false);
      slides.slideNext(350);
      slides.lockSwipes(true);
      this.typedJs = false;
      
      this.randomizeAnswerArray();

      this.questionResponseClass = "normal"
      this.hintText = this.questionData[this.questionIndex].hintText

      setTimeout(()=> {
        this.typedJs = true;

        if (this.currentCategory == 'mathematics' && this.currentLevel > 0) {
          this.timeLeft = this.timeLeft * (this.currentLevel + 1);
        } else {
          this.timeLeft = 10;
        }
        
        this.startTimer();

        setTimeout(()=> {
          this.answerButtons = true;
          this.userInputOk = true;
        }, 300);
      }, 700);
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

  async ionViewWillEnter() {
    this.audioEnabled = await getGameData("game_audio")
    this.musicEnabled = await getGameData("game_music")
    this.inputEnabled = false;
    this.typedJs = false;

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      this.showGameModal();
    });
  }

  ionViewDidEnter() {
    this.questionData = this.scoreData.getGameData('currentQuestionsData').questions
    this.currentCategory = this.scoreData.getGameData('currentCategoryId');
    this.currentLevel = this.scoreData.getGameData('currentLevelNumber');
    this.currentLevelTrue = (this.scoreData.getGameData('currentLevelNumberTrue')).toString();

    this.hintText = this.questionData[this.questionIndex].hintText;
    this.typedJs = false;

    this.roundStar1Requirement = this.scoreData.getGameData('roundStar1Requirement')
    this.roundStar2Requirement = this.scoreData.getGameData('roundStar2Requirement')
    this.roundStar3Requirement = this.scoreData.getGameData('roundStar3Requirement')

    this.oldScore = this.scoreData.getGameData('lastGameScore');

    let slides = document.querySelector('ion-slides');
    slides.options = this.slideOptions;
    slides.lockSwipes(true);

    this.questionResponseClass = "normal";

    if (this.currentCategory == 'mathematics' && this.currentLevel > 0) {
      this.timeLeft = this.timeLeft * (this.currentLevel + 1);
    }

    this.modalVisible = true;
    this.inputEnabled = false;
    this.isCountdown = true;
    this.hintText = this.questionData[this.questionIndex].hintText;
    this.typedJs = false;
    this.isDone = false;

    setTimeout(()=> {
      this.modalFade = "fadeIn";
      setTimeout(()=> {
        this.startCountdown();
      }, 400);
    }, 300);
  }
}
