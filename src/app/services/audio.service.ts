import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins } from "@capacitor/core";
const { NativeAudio } = Plugins;
import { getGameData, setGameData } from './game-storage.service';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';

interface Sound {
  key: string;
  asset: string;
  isNative: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private sounds: Sound[] = [];
  private audioPlayer: HTMLAudioElement = new Audio();
  private bgAudioPlayer: HTMLAudioElement = new Audio();
  private forceWebAudio: boolean = false;
  private fadeOutInterval: any;
  private fadeInInterval: any;
  private fadeOutVolume: any;
  private fadeInVolume: any;

  constructor(private platform: Platform){

  }

  public preload(key: string, asset: string): void {
    var raw = /[^/]*$/.exec(asset)[0];
    var actualAsset = raw.split('.').slice(0, -1).join('.')

    if(this.platform.is('capacitor') && !this.forceWebAudio){
      NativeAudio.preloadComplex({
        assetPath: actualAsset,
        assetId: key,
        volume: 1.0,
        audioChannelNum: 1,
        isUrl: false
      });

      this.sounds.push({
        key: key,
        asset: asset,
        isNative: true
      });

    } else {

      let audio = new Audio();
      audio.src = asset;

      this.sounds.push({
        key: key,
        asset: asset,
        isNative: false
      });

    }
  }

  public preloadBgm(key: string, asset: any): void {
    var raw = /[^/]*$/.exec(asset)[0];
    var actualAsset = raw.split('.').slice(0, -1).join('.')

    if(this.platform.is('capacitor') && !this.forceWebAudio){

      NativeAudio.preloadComplex({
        assetPath: actualAsset,
        assetId: key,
        volume: 0.0,
        audioChannelNum: 1,
        fade: true,
        isUrl: false
      });

      this.sounds.push({
        key: key,
        asset: asset,
        isNative: true
      });

    } else {

      this.bgAudioPlayer.src = asset;

      this.sounds.push({
        key: key,
        asset: asset,
        isNative: false
      });

    }
  }

  public unloadBgm(key: string): void {

    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });

    if(this.platform.is('capacitor') && !this.forceWebAudio) {
      NativeAudio.unload({
        assetId: key,
      });
    } else {
      this.bgAudioPlayer.src = soundToPlay.asset;
      this.bgAudioPlayer.loop = true;
    }
  }

  public async playBgm(key: string): Promise<void> {

    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });

    if(this.platform.is('capacitor') && !this.forceWebAudio){
      NativeAudio.loop({
        assetId: key,
      });
      
      await this.fadeIn(soundToPlay.key)
      
    } else {
      this.bgAudioPlayer.src = soundToPlay.asset;
      this.bgAudioPlayer.volume = 0.8;
      this.bgAudioPlayer.loop = true;
      this.bgAudioPlayer.play();
    }
  }

  public resumeBgm(key: string): void {

    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });

    if(this.platform.is('capacitor') && !this.forceWebAudio){
      NativeAudio.resume({
        assetId: key,
      });
    } else {
      this.bgAudioPlayer.play();
    }
  }

  private async fadeIn(key: string): Promise<void> {
    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });

    this.fadeInVolume = 0.0
    await this.fadeInVolume

    this.fadeInInterval = setInterval(() => {
      if ( this.fadeInVolume < 0.8 ) {
        this.fadeInVolume + 0.01;

        NativeAudio.setVolume({
          assetId: soundToPlay.key,
          volume: this.fadeInVolume,
        });
      } else {
        clearInterval(this.fadeInInterval);
        this.fadeInInterval = undefined;
      }
    }, 190)
  }

  private async fadeOut(key: string): Promise<void> {
    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });

    this.fadeOutVolume = 0.8
    await this.fadeOutVolume

    this.fadeOutInterval = setInterval(() => {
      if ( this.fadeOutVolume > 0.0 ) {
        this.fadeOutVolume - 0.01;

        NativeAudio.setVolume({
          assetId: soundToPlay.key,
          volume: this.fadeOutVolume,
        });
      } else {
        clearInterval(this.fadeOutInterval);
        this.fadeOutInterval = undefined;
      }
    }, 190)
  }

  public async stopBgm(key: string): Promise<void> {

    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });

    if(soundToPlay.isNative){
      await this.fadeOut(soundToPlay.key)

      NativeAudio.stop({
        assetId: soundToPlay.key,
      });
    } else {
      this.bgAudioPlayer.src = soundToPlay.asset;
      this.bgAudioPlayer.loop = true;
    }
  }

  public async pauseBgm(key: string): Promise<void> {

    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });
    await this.fadeOut(soundToPlay.key)
    if(this.platform.is('capacitor') && !this.forceWebAudio){
      NativeAudio.pause({
        assetId: key,
      });
    } else {
      this.bgAudioPlayer.pause();
    }
  }

  public setBgmVolume(key: string, volume: number): void {

    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });

    if(this.platform.is('capacitor') && !this.forceWebAudio){
      NativeAudio.setVolume({
        assetId: soundToPlay.key,
        volume: volume,
      });
    } else {
      this.bgAudioPlayer.volume = volume;
    }
  }

  public playSfx(key: string): void {

    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });

    if(this.platform.is('capacitor') && !this.forceWebAudio){
      NativeAudio.loop({
        assetId: soundToPlay.key,
      });

      NativeAudio.play({
        assetId: soundToPlay.key,
      });
    } else {
      this.audioPlayer.src = soundToPlay.asset;
      this.audioPlayer.play();
    }
  }

  public async setBgmState(state: boolean) {
    setGameData("game_music", state);
  }

  public async setSfxState(state: boolean) {
    setGameData("game_audio", state);
  }

  public async getBgmState() {
    await getGameData("game_music");
  }

  public async getSfxState() {
    await getGameData("game_audio");
  }
}