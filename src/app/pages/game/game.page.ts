import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { trigger, transition, animate, style } from '@angular/animations'

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
  
  correctRemarkArray = [
    'Great job!',
    'You got the correct answer!',
    'Amazing!',
    'Such a champ!',
    'Smart choice!',
    'Awesome!',
    'Correct answer!',
    'Best pick!',
    'You picked the right answer!',
    'Woah!'
  ];
  
  incorrectRemarkArray = [
    'Oh noes!',
    'I thought so too!',
    'Oh no!',
    'You\'re on the right track.',
    'It\'s not exactly what I\'m looking for.',
    'I see where you\'re going.',
    'That\'s okay.',
    'You got the spirit!',
    'Oh noes!',
    'You did great anyway!'
  ];

  randomAudioSelection: number;
  randomRemarkSelection: number;

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

  // Score
  currentScore: number = 0;
  questionScore: number = 0;
  totalPossibleScore: number = 0;
  animateScore: boolean = false;

  multiplierScore: number;
  actualScore: number;
  oldScore: any;

  // Stars
  roundStars: number = 0;
  roundStar1Requirement: number = 0;
  roundStar2Requirement: number = 0;
  roundStar3Requirement: number = 0;

  userAnswer: any;
  questionResponseClass: any;
  questionResponseString: string;
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

  musicEnabled: any;
  audioEnabled: any;

  constructor(private navCtrl: NavController, private platform: Platform, private audio: AudioService, public alertController: AlertController, private gameData: GameDataService) {}

  ngOnInit() {
    // Load Game Data
    this.questionData = this.gameData.getGameData('currentQuestionsData');
    this.currentCategory = this.gameData.getGameData('currentCategoryId');
    this.currentLevel = this.gameData.getGameData('currentLevelNumber');
    this.currentLevelTrue = this.gameData.getGameData('currentLevelNumberTrue');
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

  startTimer() {
      this.interval = setInterval(() => {
        if(this.timeLeft > 1) {
          this.timeLeft--;
        } else {
          this.timeLeft = 0;
          this.randomRemarkSelection = Math.floor(Math.random()*this.correctRemarkArray.length);
          this.questionResponseString = this.incorrectRemarkArray[this.randomRemarkSelection]
          this.questionResponseClass = "incorrect"
          this.questionResponse()
        }
      }, 1000)
  }

  async checkStarScore() {
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
    this.userAnswer = this.questionData[this.questionIndex].answers[index]
    this.randomRemarkSelection = Math.floor(Math.random()*this.correctRemarkArray.length);

    if (this.timeLeft > 5) {
      this.multiplierScore = this.questionScore / 10
    } else {  
      this.multiplierScore = this.questionScore / 8
    }
    
    // Only set timer score for Science and Literature, and Math L1
    if (this.currentCategory == 'mathematics' && this.currentLevel >= 1) {
      this.actualScore = this.questionScore
    } else {
      this.actualScore = Math.round(this.multiplierScore * this.timeLeft)
    }
    
    // Check if the answer user selected is correct
    if (this.id > -1) {
      if (this.userAnswer.correct) {
          this.currentScore = this.currentScore + this.actualScore;
          this.questionResponseClass = "correct"
          this.questionResponseString = this.correctRemarkArray[this.randomRemarkSelection]
          this.animateScore = true;
          this.questionResponse()
      }
      else {
          this.questionResponseClass = "incorrect"
          this.questionResponseString = this.incorrectRemarkArray[this.randomRemarkSelection]
          this.questionResponse()
      }
    }
  }

  questionResponse() {
    this.answerButtons = false;
    this.typedJs = false;
    this.userInputOk = false;
    clearInterval(this.interval);
    
    this.checkStarScore();

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
    this.animateScore = false;

    if (this.questionIndex >= this.questionData.length - 1) {
      this.questionIndex = 0

      this.audio.stopBgm("game-bgm-level-screen");
      this.gameData.setScoreInfo(this.currentCategory, this.currentLevel, this.currentScore)
      this.gameData.setStarInfo(this.currentCategory, this.currentLevel, this.roundStars)
    
      if (this.currentScore > this.oldScore) {
        this.gameData.setGameData('newHighScore', 'newHighScore');
      } else {
        this.gameData.setGameData('newHighScore', 'noNewHighScore');
      }

      this.gameData.setGameData('currentGameScore', this.currentScore);
      this.gameData.setGameData('currentGameStars', this.roundStars);
      this.navCtrl.navigateRoot(['/results'], { animated: true, animationDirection: 'forward' });
    }
    else {
      let slides = document.querySelector('ion-slides');
      // Else, present new question
      this.questionIndex = this.questionIndex + 1;
      slides.lockSwipes(false);
      slides.slideNext(350);
      slides.lockSwipes(true);
      this.typedJs = false;
      
      // this.randomizeAnswerArray();

      this.questionResponseClass = "normal"
      this.hintText = this.questionData[this.questionIndex].hintText

      setTimeout(()=> {
        this.typedJs = true;

        if (this.currentCategory == 'mathematics' && this.currentLevel >= 1) {
          this.timeLeft = this.timeLeft * this.currentLevelTrue;
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

  ionViewWillEnter() {
    // 0. Disable Typed.js Component, as well as input
    this.inputEnabled = false;
    this.typedJs = false;
    this.isDone = false;

    this.roundStar1Requirement = this.gameData.getGameData('roundStar1Requirement');
    this.roundStar2Requirement = this.gameData.getGameData('roundStar2Requirement');
    this.roundStar3Requirement = this.gameData.getGameData('roundStar3Requirement');
    this.oldScore = this.gameData.getGameData('lastGameScore');
    
    // 2. Randomize Answers
    // this.randomizeAnswerArray();

    // 3. Set slide options
    let slides = document.querySelector('ion-slides');
    slides.options = this.slideOptions;
    slides.lockSwipes(true);

    this.questionResponseClass = "normal";

    if (this.currentCategory == 'mathematics' && this.currentLevel >= 1) {
      this.timeLeft = this.timeLeft * this.currentLevelTrue;
    }
  }

  async ionViewDidEnter() {
    this.audioEnabled = await getGameData("game_audio");
    this.musicEnabled = await getGameData("game_music");

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      this.showGameModal();
    });

    this.modalVisible = true;
    this.isCountdown = true;

    setTimeout(()=> {
      this.modalFade = "fadeIn";
      setTimeout(()=> {
        this.startCountdown();
      }, 400);
    }, 300);

  }
}
