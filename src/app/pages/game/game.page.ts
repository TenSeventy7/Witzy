import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameDataService } from '../../services/game-data.service';
import { GameServiceService } from 'src/app/services/game-service.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  slideOptions = {
    slidesPerView: 1,
    loop: false,
    centeredSlides: true,
    centeredSlidesBounds: true,
    preventInteractionOnTransition: true
  };

  counter= 9
  score: number = 0;
  id = 0
  questions: any
  life = 3
  //bool qui active les anim CSS des buttons
  isAnswerButtonPressed = [false,false,false]
  isActive2 = false
  isAnswerButtonsActive = true
  response: any

  solutionTitle: string
  solutionText: string
  solutionDiv: boolean
  

  CheckButton = true
  disabledButton: boolean

  constructor(private router: Router, private gameServiceService: GameServiceService, private scoreData: GameDataService) {}

  ngOnInit() {
    this.questions = this.gameServiceService.questionsChapter1
    //this.randomizeQuestions()
    this.randomizeAnswers()
    this.disabledButton = true
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
