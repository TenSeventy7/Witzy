import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameDataService {
 
  private encodedId: any;
  private data = [];
 
  constructor() { }
 
  // Encode data to Base64 to obfuscate data and to make it
  // more-or-less compatible with Angular
  setGameData(id, data) {
    this.encodedId = btoa(id);
    this.data[this.encodedId] = data;
  }
 
  getGameData(id) {
    this.encodedId = btoa(id);
    if (this.data[this.encodedId]) {
      return this.data[this.encodedId];
    } else {
      console.log('Err: Data not found for ID ' + id)
      return ' ';
    }
  }
}
