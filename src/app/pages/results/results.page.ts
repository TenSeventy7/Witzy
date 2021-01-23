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
    if (this.route.snapshot.data['gameScore']) {
      this.gameResult = this.route.snapshot.data['gameScore'];
    }
    console.log(this.route.snapshot.data['gameScore']);
  }

}
