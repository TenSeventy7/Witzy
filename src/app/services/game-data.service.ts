import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameDataService {
 
  private encodedData: any;
  private decodedData: any;
  private encodedId: any;
  private data = [];
 
  constructor() { }
 
  // Encode data to Base64 to obfuscate data and to make it
  // more-or-less compatible with Angular
  setGameData(id, data) {
    this.encodedId = btoa(id);
    this.encodedData = btoa(data);
    this.data[this.encodedId] = this.encodedData;
  }
 
  getGameData(id) {
    this.encodedId = btoa(id);
    if (this.data[this.encodedId]) {
      this.decodedData = atob(this.data[this.encodedId]);
    } else {
      console.log('Err: Data not found for ID ' + id)
      this.decodedData = ' ';
    }
    return this.decodedData;
  }
}
