import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() name: string;
  @Input() backLink: string;

  constructor(private navCtrl: NavController) { }

  onClickBack() {
    this.navCtrl.navigateRoot([this.backLink], { animated: true, animationDirection: 'back' });
  }

  ngOnInit() {}

}
