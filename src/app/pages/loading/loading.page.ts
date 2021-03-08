import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { AudioService } from '../../services/audio.service';
import { GameDataService } from '../../services/game-data.service';
import { getGameData, setGameData } from '../../services/game-storage.service';

interface QuestionData {
  questionScore: number,
  questionText: string,
  solutionText: string,
  hintText: string,
  answers: []
}

interface AnswerData {
  answer: string,
  correct: boolean,
  selected: boolean
}

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})

export class LoadingPage implements OnInit {

  questions: QuestionData[] = [];
  questionScore: number;
  questionText: string;
  solutionText: string;
  hintText: string;
  answers: AnswerData[] = [];

  splashProgress: number = 0.1;
  categoryData: any;
  categoryId: any;
  completeLevelData: any;
  musicEnabled: boolean;
  audioEnabled: boolean;
  currentCategoryId: any;
  jsonUrl: any;
  currentLevel: any;

  questionData: any;
  randomQuestions: any;
  randomAnswers: any;
  lastGameScore: any;
  totalPossibleScore: number = 0;
  roundStar1Requirement: number = 0;
  roundStar2Requirement: number = 0;
  roundStar3Requirement: number = 0;

  constructor(private navCtrl: NavController, private platform: Platform, private audio: AudioService, private gameData: GameDataService) { }

  ngOnInit() {
    this.splashProgress = 0.1;
  }

  calculateRequiredStars() {
    // Calculate the scores needed based on the total possible score.
    for (var index = 0; index < this.questionData.length; index++) {
      // Get total score based on question index
      var questionScore: number = this.questionData[index].questionScore;
      this.totalPossibleScore = this.totalPossibleScore + questionScore;
      this.splashProgress = this.splashProgress + 0.05;
    }
    
    this.roundStar1Requirement = Math.round(this.totalPossibleScore / 3); // Divide total score by three
    this.roundStar2Requirement = Math.round(this.roundStar1Requirement * 2); // Multiply first star requirement by 2
    this.roundStar3Requirement = Math.round((this.totalPossibleScore / 4.75) + this.roundStar2Requirement); // Divide total score by three, then add first star requirement

    this.gameData.setGameData('roundStar1Requirement', this.roundStar1Requirement)
    this.gameData.setGameData('roundStar2Requirement', this.roundStar2Requirement)
    this.gameData.setGameData('roundStar3Requirement', this.roundStar3Requirement)
  }

  randomize(data) {
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

    return shuffleArray(data)
  }

  preloadAudio(key: string, file: string) {
    this.audio.preload(key, file);
    this.splashProgress = this.splashProgress + 0.025
  }

  async ionViewWillEnter() {
    this.currentCategoryId = await this.gameData.getGameData('currentCategoryId')
    this.audio.preloadBgm("game-bgm-level-screen", '/assets/music/game_bgm_level_screen.ogg');
    
    this.jsonUrl = await this.gameData.getGameData('levelJsonData');
    this.currentLevel = await this.gameData.getGameData('currentLevelNumber');

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      console.log("Back disabled.")
    });
  }

  async ionViewDidEnter() {
    this.splashProgress = 0.1;
    this.lastGameScore = await this.gameData.getScoreInfo(this.currentCategoryId, this.currentLevel);
    this.splashProgress = 0.3;

    await this.gameData.getGameInfo(this.jsonUrl, 'currentQuestionsData', false);

    this.gameData.setGameData('lastGameScore', this.lastGameScore)
    this.questionData = await this.gameData.getGameData('currentQuestionsData').questions
    this.calculateRequiredStars();

    this.randomQuestions = this.randomize(this.questionData);
    this.splashProgress = 0.5;
    
    for (var index = 0; index < this.randomQuestions.length; index++) {
      this.questionScore = this.randomQuestions[index].questionScore;
      this.questionText = this.randomQuestions[index].questionText;
      this.solutionText = this.randomQuestions[index].solutionText;
      this.hintText = this.randomQuestions[index].hintText;
      this.answers = this.randomQuestions[index].answers;
      this.randomAnswers = this.randomize(this.answers);

      this.questions.push({
        questionScore: this.questionScore,
        questionText: this.questionText,
        solutionText: this.solutionText,
        hintText: this.hintText,
        answers: this.randomAnswers
      });

      this.splashProgress = this.splashProgress + 0.05;
    }

    this.gameData.setGameData('currentQuestionsData', this.questions)
    this.splashProgress = 0.8;

    setTimeout(()=> {
      this.splashProgress = 0.9;
      this.navCtrl.navigateRoot(['/game'], { animated: true, animationDirection: 'forward' });
    }, 1500);
  }

  ionViewDidLeave() {
    this.splashProgress = 0.1;
  }
}
