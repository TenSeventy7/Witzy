import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  tnsLogo: any;
  uphLogo: any;
  textLogo: any;

  tnsTime: any;
  uphTime: any;
  textTime: any;

  constructor(private navCtrl: NavController, private platform: Platform) { }

  ngOnInit() {
    setTimeout(()=> {
      this.tnsLogo = "fade"
      this.uphLogo = ""
      this.textLogo = ""
      
    }, 400);

    this.tnsTime = setTimeout(()=> {
      this.showUphLogo();
    }, 3500);
  }

  showUphLogo() {
    clearInterval(this.tnsTime);
    this.tnsLogo = ""
    this.uphLogo = "fade"
    this.textLogo = ""
      
    this.uphTime = setTimeout(()=> {
      this.showTextLogo();
    }, 3500);
  }

  showTextLogo() {
    clearInterval(this.uphTime);
    this.tnsLogo = ""
    this.uphLogo = ""
    this.textLogo = "fade"

    this.textTime = setTimeout(()=> {
      this.goToSplash();
    }, 3500);
  }

  goToSplash() {
    clearInterval(this.textTime);
    this.tnsLogo = ""
    this.uphLogo = ""
    this.textLogo = ""
    this.navCtrl.navigateRoot(['/splash'], { animated: false, animationDirection: 'forward' });
  }

}
