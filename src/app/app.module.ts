import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPageModule} from '../pages/login/login.module';
import { RegisterPage} from '../pages/register/register';
import { ResetPasswordPageModule } from '../pages/reset-password/reset-password.module';
import { NotificationsPage } from '../pages/notifications/notifications';
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';

import {AngularFireDatabaseModule} from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthProvider } from '../providers/auth/auth';


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
    RegisterPage,
    NotificationsPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    LoginPageModule,
    ResetPasswordPageModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegisterPage,
    NotificationsPage,
  ],
  providers: [
    BackgroundGeolocation,
    GoogleMaps,
    Geolocation,
    StatusBar,
    AuthProvider,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LocationTrackerProvider, Geolocation, GoogleMaps,
    AuthProvider
  ]
})
export class AppModule {}
