import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { GameDataService } from './../services/game-data.service';

@Injectable({
  providedIn: 'root'
})
export class GameDataResolverService implements Resolve<any> {

  constructor(private gameData: GameDataService) { }

  resolve(route: ActivatedRouteSnapshot) {
    let handle = route.paramMap.get('id');
    return this.gameData.getGameData(handle);
  }
}
