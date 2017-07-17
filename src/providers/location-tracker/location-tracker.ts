import { Injectable, NgZone } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BackgroundGeolocation} from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
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
  targetList: FirebaseListObservable<any[]>;

  constructor(public zone: NgZone, afDB: AngularFireDatabase,private backgroundGeolocation: BackgroundGeolocation, private geolocation: Geolocation) {
    console.log('Hello LocationTrackerProvider Provider');
    this.targetList = afDB.list('/devices');

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
        this.savePosition(this.lat,this.lng,this.timestamp);
      });


    });



  }

  stopTracking() {

    console.log('stopTracking');

    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();

  }

  //Saving to Firebase
  savePosition(latitude, longitude, timestamp) {
    this.targetList.push({
      latitude: latitude,
      longitude: longitude,
      timestamp: timestamp,
    }).then( error => {
      console.log(error);
    });
  }

}
