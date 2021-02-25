import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Lottie/Bodymovin' Support
import { defineCustomElements as loadLottieBodymovin } from '@teamhive/lottie-player/loader';

loadLottieBodymovin(window);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
