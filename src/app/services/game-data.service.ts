import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getGameData, setGameData } from '../services/game-storage.service';

interface LevelData {
  disabled: boolean,
  starsObtained: number,
  levelId: number,
  levelDesc: string,
  levelRemark: string,
  neededStars: number,
  levelUrl: string
}

@Injectable({
  providedIn: 'root'
})
export class GameDataService {
 
  private encodedId: any;
  private formerStars: any;
  private receivedData: any;
  private neededStars: any;
  private formerLevel: any;
  private response: any;
  private data = [];
  private persistentData = [];
  private fetched: any;
  private category: any;
  private oldScore: any;
  private oldStars: any;
  private starsObtained: number
  private levelId: number
  private levelDesc: string
  private levelRemark: string
  private levelUrl: string

  levelData: LevelData[] = []
 
  constructor(private http: HttpClient) { }
 
  // Encode data to Base64 to obfuscate data and to make it
  // more-or-less compatible with Angular
  setGameData(id: string, data: any) {
    this.encodedId = btoa(id);
    this.data[this.encodedId] = data;
  }
 
  getGameData(id: string) {
    this.encodedId = btoa(id);

    if (this.data[this.encodedId]) {
      return this.data[this.encodedId];
    } else {
      console.log('Err: Data not found for ID ' + id)
      return ' ';
    }
  }

  setPersistentGameData(id: string, data: any) {
    this.encodedId = btoa(id);
    setGameData("temp_"+this.encodedId, data)
  }
 
  async getPersistentGameData(id: string) {
    this.encodedId = btoa(id);
    this.persistentData = await getGameData("temp_"+this.encodedId);

    if (this.persistentData) {
      return this.persistentData;
    } else {
      console.log('Err: Persistent data not found for ID ' + id)
      return ' ';
    }
  }

  getGameInfo(url: string, key: string, persist: boolean) {
    return new Promise<void>((resolve, reject) => {
      this.http.get(url, {responseType: 'text'}).toPromise().then(
        (data) => {
        this.fetched = data
        const decodedData = atob(this.fetched);
        const jsonData = JSON.parse(decodedData)

        if (persist) {
          this.setPersistentGameData(key, jsonData);
        } else {
          this.setGameData(key, jsonData);
        }
        resolve();
      });
    });
  }

  async getScoreInfo(category: string, level: any) {
    this.response = await getGameData("levelData_"+category+level+"_score");
    return this.response
  }

  async getStarInfo(category: string, level: any) {
    this.response = await getGameData("levelData_"+category+level+"_stars");
    return this.response
  }

  async setScoreInfo(category: string, level: any, score: number) {
    this.oldScore = await this.getScoreInfo(category, level)

    if (score > this.oldScore) {
      setGameData("levelData_"+category+level+"_score", score);
    }
  }

  async setStarInfo(category: string, level: any, stars: number) {
    this.oldStars = await this.getStarInfo(category, level)

    if (stars > this.oldStars) {
      setGameData("levelData_"+category+level+"_stars", stars);
    }
  }

  async getUnlockedLevels(category:string) {
    this.receivedData = await this.getPersistentGameData('currentLevelData_'+category)
    this.category = this.receivedData.levels
    this.levelData = []

    for (var index = 0; index < this.category.length; index++) {
      // Level Info
      this.levelId = this.category[index].levelId
      this.levelDesc = this.category[index].levelDesc
      this.levelRemark = this.category[index].levelRemark
      this.neededStars = this.category[index].neededStars
      this.levelUrl = this.category[index].levelUrl
      this.starsObtained = await this.getStarInfo(category, index);
      this.formerLevel = (index - 1).toString();
      this.formerStars = await this.getStarInfo(category, this.formerLevel);
      this.neededStars = this.category[index].neededStars;

      if ( this.formerStars >= this.neededStars ) {

        this.levelData.push({
          disabled: false,
          starsObtained: this.starsObtained,
          levelId: this.levelId,
          levelDesc: this.levelDesc,
          levelRemark: this.levelRemark,
          neededStars: this.neededStars,
          levelUrl: this.levelUrl
        });

      } else {
        
        this.levelData.push({
          disabled: true,
          starsObtained: this.starsObtained,
          levelId: this.levelId,
          levelDesc: this.levelDesc,
          levelRemark: this.levelRemark,
          neededStars: this.neededStars,
          levelUrl: this.levelUrl
        });

      }
    }
    this.setPersistentGameData("levelData_"+category, this.levelData);
    return this.getPersistentGameData("levelData_"+category);
  }
}
