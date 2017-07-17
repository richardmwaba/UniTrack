import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//import { LocationTracker } from '../../providers/location-tracker';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  targetList: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController, afDB: AngularFireDatabase,public locationTracker: LocationTrackerProvider) {
    this.targetList = afDB.list('/targets');
  }

  start(){
    this.locationTracker.startTracking();

  }

  stop(){
    this.locationTracker.stopTracking();
  }

}
