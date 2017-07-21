import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {Component} from '@angular/core';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage} from '../pages/login/login';
import { RegisterPage} from '../pages/register/register';
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Autostart } from '@ionic-native/autostart';
import { BackgroundFetch } from '@ionic-native/background-fetch';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyBVujRzh16eLZq5zceOl53B6O8QS6mUbdY",
  authDomain: "devicetracker-31792.firebaseapp.com",
  databaseURL: "https://devicetracker-31792.firebaseio.com",
  projectId: "devicetracker-31792",
  storageBucket: "devicetracker-31792.appspot.com",
  messagingSenderId: "799447247436"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    //AngularFireAuthModule
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage
  ],
  providers: [
    BackgroundGeolocation,
    BackgroundFetch,
    BackgroundMode,
    Autostart,
    Geolocation,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LocationTrackerProvider
  ]
})
export class AppModule {}
