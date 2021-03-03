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

  constructor(private navCtrl: NavController, private platform: Platform) { }

  ngOnInit() {
    setTimeout(()=> {
      this.tnsLogo = "fade"
      this.uphLogo = ""
      this.textLogo = ""
      
    }, 400);

    setTimeout(()=> {
      this.tnsLogo = ""
      this.uphLogo = "fade"
      this.textLogo = ""
      
      setTimeout(()=> {
        this.tnsLogo = ""
        this.uphLogo = ""
        this.textLogo = "fade"

        setTimeout(()=> {
          this.tnsLogo = ""
          this.uphLogo = ""
          this.textLogo = ""
          this.navCtrl.navigateRoot(['/splash'], { animated: false, animationDirection: 'forward' });
        }, 3500);        
      }, 3500);
    }, 3500);
  }

}
