import { CurrentGameDataService } from './../services/current-game-data.service';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
 
@Injectable({
  providedIn: 'root'
})
export class CurrentGameDataResolverService implements Resolve<any> {
 
  constructor(private currentGame: CurrentGameDataService) { }
 
  resolve(route: ActivatedRouteSnapshot) {
    let id = 'gameScore'
    return this.currentGame.getData(id);
  }
}
