import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { LoginPage} from '../pages/login/login';
import { BackgroundMode } from '@ionic-native/background-mode';
import { BackgroundFetch, BackgroundFetchConfig } from '@ionic-native/background-fetch';
import { Autostart } from '@ionic-native/autostart';
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(public locationTracker: LocationTrackerProvider,private autostart: Autostart, private backgroundFetch: BackgroundFetch, private backgroundMode: BackgroundMode, private afAuth: AngularFireAuth, public afDB: AngularFireDatabase, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      //enable auto start after a reboot
      this.autostart.enable();

      const config: BackgroundFetchConfig = {
        stopOnTerminate: false, // Set true to cease background-fetch from operating after user "closes" the app. Defaults to true.
      };

      //enable background mode
      this.backgroundMode.enable();
      backgroundFetch.configure(config)
        .then(() => {
          console.log('Background Fetch initialized');
          //listen to changes in database for cloud functions
          this.afDB.database.ref('/messages/-KpRpvUXX6LoYf9nVUVX/original/').on('value', snapshot => {
            console.log(snapshot.val());
            if (snapshot.val()=='true'){
                this.locationTracker.startTracking();
            }else {
                  this.locationTracker.stopTracking();
                }
          });
          this.backgroundFetch.finish();

        })
        .catch(e => console.log('Error initializing background fetch', e));

      // Start the background-fetch API. Your callbackFn provided to #configure will be executed each time a background-fetch event occurs. NOTE the #configure method automatically calls #start. You do not have to call this method after you #configure the plugin
      backgroundFetch.start();

      // Stop the background-fetch API from firing fetch events. Your callbackFn provided to #configure will no longer be executed.
      //backgroundFetch.stop();

    });
  }

}
