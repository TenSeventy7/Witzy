import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
 
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IonicModule.forRoot({ mode: 'ios' }),
    AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    NativeAudio,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
