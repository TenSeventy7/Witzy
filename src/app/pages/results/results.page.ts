import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  hintText: string;
  constructor(private route: ActivatedRoute, private scoreData: GameDataService) { }

  ngOnInit() {
    this.gameStars = this.scoreData.getGameData('currentGameStars');
    this.gameResult = this.scoreData.getGameData('currentGameScore');
    this.gameLevel = (this.scoreData.getGameData('currentLevelNumberTrue')).toString();
    this.hintText = 'Wow';
  }

}
