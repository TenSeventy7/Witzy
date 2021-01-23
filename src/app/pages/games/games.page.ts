import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-games',
  templateUrl: 'games.page.html',
  styleUrls: ['games.page.scss']
})
export class GamesPage {

  user: User[]
  
  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.user = this.accountService.users
  }
  
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
}
