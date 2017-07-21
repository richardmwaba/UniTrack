import { Injectable, NgZone } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BackgroundGeolocation} from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
//import {timestamp} from "rxjs/operator/timestamp";

/*
  Generated class for the LocationTrackerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LocationTrackerProvider {

  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  public timestamp: number = 0;
  public devices: FirebaseObjectObservable<any>;
  //targetList: FirebaseListObservable<any[]>;
  public userId: any;
  public userEmail: any;
  public device: any;
  // Get a reference to the database service

  constructor(public zone: NgZone,
    afDB: AngularFireDatabase,
    private backgroundGeolocation: BackgroundGeolocation,
    private afAuth: AngularFireAuth,
    private geolocation: Geolocation) {

    console.log('Hello LocationTrackerProvider Provider');
    this.afAuth.authState.subscribe(auth => {
       if(auth) {
          let userId = auth.uid;
          this.userEmail = auth.email;
           console.log('You are authenticated', this.userEmail)
           //this.targetList = afDB.list('/targets/')
           this.device = afDB.object('/devices/'+ auth.uid);
       } else {
           console.log('You are not authenticated')
       }

     });


  }

  startTracking() {
    // Background Tracking

    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
      interval: 50000
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {

      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
        this.timestamp = location.timestamp;
        this.saveObject(this.lat,this.lng,this.timestamp, this.userEmail);
      });

    }, (err) => {

      console.log(err);

    });

    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();


    // Foreground Tracking

    let options = {
      frequency: 50000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

      console.log(position);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.timestamp = position.timestamp;
        //Call to save method that saves to firebase
        //this.savePosition(this.lat,this.lng,this.timestamp);
        this.saveObject(this.lat,this.lng,this.timestamp, this.userEmail);
      });


    });



  }

  stopTracking() {

    console.log('stopTracking');

    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();

  }

  //Saving to Firebase
  // savePosition(latitude, longitude, timestamp) {
  //   this.targetList.push({
  //     latitude: latitude,
  //     longitude: longitude,
  //     timestamp: timestamp,
  //   } ).then( error => {
  //     console.log(error);
  //   });
  // }

  saveObject(lat, lng, time, email){
     this.device.set({
       lat: lat,
       lng: lng,
       time: time,
       email: email,
     }).then(_ => console.log('set!'));
  }


}
