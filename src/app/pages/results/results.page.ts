import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit {
  gameResult: any;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.snapshot.data['currentGameScore']) {
      this.gameResult = this.route.snapshot.data['currentGameScore'];
      console.log('Inf: Player score for game is ' + this.route.snapshot.data['currentGameScore']);
    }
  }

}
