import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
//import { LocationTracker } from '../../providers/location-tracker';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../models/user';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user = {} as User;

  targetList: FirebaseListObservable<any[]>;

  constructor(
    private afAuth: AngularFireAuth,
    private toast: ToastController,
    public navCtrl: NavController, afDB: AngularFireDatabase,
    public locationTracker: LocationTrackerProvider) {
    this.targetList = afDB.list('/targets');
  }

  ionViewWillLoad(){
    this.afAuth.authState.subscribe(data => {
      if(data && data.email && data.uid){
        this.toast.create({
          message: 'Welcome to UniTrack',
          duration: 3000
        }).present();
      }else{
        this.toast.create({
          message: 'Sorry, We coud not find these authentication details',
          duration: 3000
        }).present();
      }
    });
  }

  start(){
    this.locationTracker.startTracking();

  }

  stop(){
    this.locationTracker.stopTracking();
  }

  async logout(user: User){
    const result = this.afAuth.auth.signOut();
  }

}
