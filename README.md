![Witzy logo](https://github.com/TenSeventy7/Witzy/raw/android/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png)
# Witzy  ![Bitrise](https://app.bitrise.io/app/9a5d65144f3520f2/status.svg?token=dHMYbYdMFX2PRMAYs88InA) ![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=witzy)

The easy and **witty** game for all ages!

What if you can have fun and learn at the same time? What if you enjoy the things you normally learn at school? What if the 			chemistry or mathematics don’t have to be boring? Say hello to Witzy!

Witzy introduces two new characters, boy and alien, as well as rich colors, entertaining music, and challenging gameplay. You get five levels per category (more coming soon!) with ten questions each. You get to experience and learn from the depths of space, and answer trivia questions from your very own spaceship!

Join the adventures of boy and alien as they traverse the galaxy of knowledge and smarts!

You can also play Witzy **online!**
https://witzy.vercel.app

## About Witzy
Witzy is developed by University of Perpetual Help - GMA Campus students as our capstone project for March 2021.

**Developer:** John Vincent Corcega (TenSeventy7)

**Art Designer:** Micaela Denise Sarra

### Main Contributors

 - ANDRES, K.
 - APUNTAR, A.
 - ARANDIA, J.
 - JAMOROL, R.
 - RODAJE, R.
 - TALLOD, C.
 
### Special Thanks
* MALIMATA, C.
* LACHICA, J.
* STACKOVERFLOW (HAHA)
* PERPETUAL GMA
* YOU! (OFC)

Assets provided by Kenney Game Studios. Music provided by HeatlyBros Music.

## Developing

### Pre-requisites
* Ionic Framework 5
* node.js 12.x or higher
* npm 6 or higher

### Installation
Refer from [Ionic's](https://ionicframework.com/docs/installation/cli) documentation to install Ionic.

After cloning this repository, initialize the project's directory with Ionic.
```bash
ionic init 
```
Then install the dependencies.
```bash
npm install 
```

### Building the App
As this is built with Capacitor, build all components first then sync them before compiling.
```bash
ionic build # Add "--prod" (without quotes) to build as production
npx cap sync
```

Capacitor does not have a native way to build using the CLI. Build it using Android Studio and/or Xcode instead.
```bash
npx cap copy android
npx cap open android
```

Our project currently doesn't have iOS support out-of-the-box. You can add it yourself.
```bash
npx cap add ios
npx cap copy ios
npx cap open ios
```

Refer to [Ionic Framework](https://ionicframework.com/docs) and [Angular](https://angular.io/docsdocumentation)'s documentation to modify and/or use this app.

## Contributing
Pull requests are always welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to test code before opening a pull request as to make merging efficient and convenient for everyone. Always remember to keep your code merged with current sources as well.

## License
Witzy is licensed in [GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/).