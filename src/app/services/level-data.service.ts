import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LevelDataService {

  private response = [];
  private json: any;
  private request: string;
  private CalendarEvent: any;

  constructor(private http: HttpClient) {
  }

  getJsonFile(request: any) {
    this.http.get(request, { responseType: 'json'}).subscribe(data => {
      console.log(data);
      return data
    });
  }

}

