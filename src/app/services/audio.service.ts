import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { getGameData, setGameData } from './game-storage.service';

interface Sound {
  key: string;
  asset: string
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private sounds: Sound[] = [];
  private audioPlayer: HTMLAudioElement = new Audio();
  private bgAudioPlayer: HTMLAudioElement = new Audio();

  constructor(private platform: Platform, private nativeAudio: NativeAudio){

  }

  public preload(key: string, asset: string): void {

    let audio = new Audio();
    audio.src = asset;

    this.sounds.push({
        key: key,
        asset: asset
    });
  }

  public playBgm(key: string): void {

    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });
    
    this.bgAudioPlayer.src = soundToPlay.asset;
    this.bgAudioPlayer.loop = true;
    this.bgAudioPlayer.play();
  }

  public stopBgm(key: string): void {

    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });
    
    this.bgAudioPlayer.src = soundToPlay.asset;
    this.bgAudioPlayer.loop = true;
  }

  public setBgmVolume(key: string, volume: number): void {
    this.bgAudioPlayer.volume = volume;
  }

  public playSfx(key: string): void {

    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });
    
    this.audioPlayer.src = soundToPlay.asset;
    this.audioPlayer.volume = 0.8;
    this.audioPlayer.play();
  }

  public async setBgmState(state: boolean) {
    setGameData("game_music", state);
  }

  public async setSfxState(state: boolean) {
    setGameData("game_audio", state);
  }

  

}