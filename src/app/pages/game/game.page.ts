import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GameDataService } from '../../services/game-data.service';
import { GameServiceService } from 'src/app/services/game-service.service';
import { NgxTypedJsComponent } from 'ngx-typed-js';
import { trigger, transition, animate, style } from '@angular/animations'
import { Platform, AlertController } from '@ionic/angular';
import { AudioService } from '../../services/audio.service';

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
    'game-sfx-correct_2'
  ];
  
  incorrectSfxArray = [
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
  hintClass: string;

  cardAnimate: string = "none";
  cardClass: any;
  currentLevel: string;
  currentCategory: string;

  currentScore: number = 0;
  cuurentScoreAnimate: boolean = false;
  questionScore: number = 0;
  totalPossibleScore: number = 0;

  roundStars: number = 0;
  roundStar1Requirement: number = 0;
  roundStar2Requirement: number = 0;
  roundStar3Requirement: number = 0;

  userAnswer: any;
  questionResponseClass: any;

  counter = 9
  score: number = 0;
  id = 0
  questions: any
  questionData: any
  slideLength: number
  life = 3
  
  isAnswerButtonPressed = [false,false,false]
  isActive2 = false
  isAnswerButtonsActive = true
  response: any

  solutionTitle: string
  solutionText: string
  solutionDiv: boolean

  timeLeft: number = 10;
  interval: any;
  multiplierScore: number;
  actualScore: number;

  CheckButton = true
  disabledButton: boolean

  typedJs: boolean = true

  modalFade: string;
  currentLevelTrue: string;
  userInputOk: boolean = true;
  modalVisible: boolean = false;
  inputEnabled: boolean = true;
  modalWindowRoll: boolean = false;

  constructor(private router: Router, private platform: Platform, private audio: AudioService, public alertController: AlertController, private gameServiceService: GameServiceService, private scoreData: GameDataService) {}

  ngOnInit() {
    this.currentCategory = this.scoreData.getGameData('currentCategoryId');
    this.currentLevel = this.scoreData.getGameData('currentLevelNumber');
    this.currentLevelTrue = (this.scoreData.getGameData('currentLevelNumberTrue')).toString();
    console.log("current level is: "+this.currentLevel);
    console.log("current category is: "+this.currentCategory);


    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      console.log('Handler was called!');
      this.showGameModal();
    });

    this.questions = this.scoreData.getGameData('currentQuestionsData').questions
    this.questionData = this.scoreData.getGameData('currentQuestionsData').questions
    this.questionResponseClass = "normal"
    this.randomizeAnswers()
    this.disabledButton = true
    
    let slides = document.querySelector('ion-slides');
    slides.options = this.slideOptions;
    slides.lockSwipes(true);

    this.calculateRequiredStars();
    this.answerButtons = true;

    this.startTimer();

    this.hintText = this.questions[this.questionIndex].hintText;
  }

  showGameModal() {
    // Only allow modal show if game not presenting solution
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
              console.log('Handler was called!');
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
            console.log('Handler was called!');
            this.showGameModal();
          });

          this.startTimer();
        }, 400);
      }, 300);
    }, 400);
  }

  async presentAlertMultipleButtons() {
    const alert = await this.alertController.create({
      header: 'Exit Level',
      message: 'Are you sure you want to exit?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/exit']);
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

  calculateRequiredStars() {
    // Calculate the scores needed based on the total possible score.
    for (var index = 0; index < this.questionData.length; index++) {
      // Get total score based on question index
      var questionScore: number = this.questions[index].questionScore;
      this.totalPossibleScore = this.totalPossibleScore + questionScore;
    }

    console.log(this.totalPossibleScore);

    // Since we already have our total scores, calculate
    // the stars based on our algorithms
    this.roundStar1Requirement = Math.round(this.totalPossibleScore / 3); // Divide total score by three
    this.roundStar2Requirement = Math.round(this.roundStar1Requirement * 2); // Multiply first star requirement by 2
    this.roundStar3Requirement = Math.round((this.totalPossibleScore / 3.75) + this.roundStar2Requirement); // Divide total score by three, then add first star requirement
    
    console.log(this.roundStar1Requirement);
    console.log(this.roundStar2Requirement);
    console.log(this.roundStar3Requirement);
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
    this.questionScore = this.questions[this.questionIndex].questionScore
    if ( this.timeLeft > 5 ) {
      this.multiplierScore = this.questionScore / 10
    } else {  
      this.multiplierScore = this.questionScore / 8
    }

    this.actualScore = Math.round(this.multiplierScore * this.timeLeft)

    this.userAnswer = this.questions[this.questionIndex].answers[index]
    
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
      this.hintText = this.questions[this.questionIndex].solutionText;
      this.typedJs = true;

      setTimeout(()=> {
        this.presentNextQuestion();
      }, 4000);
    }, 300);
  }

  presentNextQuestion() {
    let slides = document.querySelector('ion-slides');
    this.cuurentScoreAnimate = false;

    if (this.questionIndex >= this.questions.length - 1) {
      // Move to score screen if quiz is finished
      this.questionIndex = 0

      this.scoreData.setScoreInfo(this.currentCategory, this.currentLevel, this.currentScore)
      this.scoreData.setStarInfo(this.currentCategory, this.currentLevel, this.roundStars)

      this.scoreData.setGameData('currentGameScore', this.currentScore);
      this.scoreData.setGameData('currentGameStars', this.roundStars);
      this.router.navigate(['/results', 'currentGameScore']);
    }
    else {
      // Else, present new question
      this.questionIndex = this.questionIndex + 1;
      this.typedJs = false;
      
      this.randomizeAnswerArray();

      slides.lockSwipes(false);

      setTimeout(()=> {
        slides.slideNext(350);
        slides.lockSwipes(true);
      }, 350);

      this.questionResponseClass = "normal"
      this.hintText = this.questions[this.questionIndex].hintText

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

    this.questions[this.questionIndex].answers = shuffleArray(this.questions[this.questionIndex].answers)
  }

  validateAnswer() {
      if(this.id > -1) {
        if(this.response.correct){
          this.score = this.score + 20;
          this.trueResponse()
      }
       else{
         this.life--
         this.falseResponse()
       }
      }
    
     this.isActive2 = !this.isActive2
     this.isAnswerButtonsActive = false
     this.CheckButton = false
  }

  
  nextQuestion(){
    this.isAnswerButtonsActive = true

    if (this.id >= this.questions.length - 1) {
      this.life = 3
      this.id = 0
      this.counter = 9
      this.disabledButton = true
      this.scoreData.setGameData('currentGameScore', this.score);
      this.router.navigate(['/results', 'currentGameScore']);
    }
    else {
      this.id++
      this.isAnswerButtonPressed = [false,false,false]
      this.randomizeAnswers()
      this.CheckButton = true
      this.disabledButton = !this.disabledButton
    }

    if (this.life === 0) {
      this.scoreData.setGameData('currentGameScore', this.score);
      this.router.navigate(['/results', 'currentGameScore']);
    }

    if (this.life === 100) {
      this.scoreData.setGameData('currentGameScore', this.score);
      this.router.navigate(['/results', 'currentGameScore']);
    }
}

randomizeAnswers()
   {
    for (let i = this.questions[this.id].answers.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = this.questions[this.id].answers[i];
        this.questions[this.id].answers[i] = this.questions[this.id].answers[j];
        this.questions[this.id].answers[j] = temp;
    }

}

answerButtonPressed(index: number){
  this.isAnswerButtonPressed = [false,false,false]
  this.isAnswerButtonPressed[index] = !this.isAnswerButtonPressed[index]

  this.response = this.questions[this.id].answers[index]
  console.log(this.response.correct)
  this.disabledButton = false
}

falseResponse(){
  this.solutionDiv = false
  this.solutionTitle = "Correct solution:"
  for(let i = this.questions[this.id].answers.length - 1; i >= 0; i--){
    if(this.questions[this.id].answers[i].correct)
        this.solutionText = this.questions[this.id].answers[i].answer
        console.log(this.solutionText)
  }
}

trueResponse(){
  this.solutionDiv = true
  this.solutionTitle = "You are correct"
  this.solutionText = ""
}

progress(){
  let progress = this.score + '%'
  return progress
}
}
