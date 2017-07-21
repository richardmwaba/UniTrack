import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';

import { LoginPage} from '../pages/login/login';
import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, afAuth: AngularFireAuth, statusBar: StatusBar, splashScreen: SplashScreen) {

    //Listen for any existing login so that user doesn't have to login again if logged in
    const authObserver = afAuth.authState.subscribe( user => {
      if (user){
        this.rootPage = HomePage;
        authObserver.unsubscribe();
      }else{
        this.rootPage = 'LoginPage';
        authObserver.unsubscribe();
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }


}
