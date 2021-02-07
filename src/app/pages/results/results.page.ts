import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameDataService } from '../../services/game-data.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit {
  gameResult: any;
  gameStars: any;
  constructor(private route: ActivatedRoute, private scoreData: GameDataService) { }

  ngOnInit() {
    if (this.route.snapshot.data['currentGameScore']) {
      this.gameStars = this.scoreData.getGameData('currentGameStars');
      this.gameResult = this.route.snapshot.data['currentGameScore'];
      console.log('Inf: Player score for game is ' + this.route.snapshot.data['currentGameScore']);
      console.log('Inf: Player star for game is ' + this.gameStars);
    }
  }

}
