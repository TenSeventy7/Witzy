import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameDataService } from '../../services/game-data.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit {
  gameResult: any = 0;
  gameStars: any = 0;
  gameLevel: any = 1;
  categoryId: any;
  hintText: string;
  constructor(private router: Router, private scoreData: GameDataService) { }

  ngOnInit() {
    this.gameStars = this.scoreData.getGameData('currentGameStars');
    this.gameResult = this.scoreData.getGameData('currentGameScore');
    this.gameLevel = (this.scoreData.getGameData('currentLevelNumberTrue')).toString();
    this.categoryId = this.scoreData.getGameData('currentCategoryId');
    this.hintText = 'Wow';
  }

  onClickPlay() {
    this.router.navigate(['/loading']);
  }

  onClickBack() {
    this.router.navigate(['/exit']);
  }

}
