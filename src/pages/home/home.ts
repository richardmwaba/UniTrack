import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ToastController, Platform } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
//import { LocationTracker } from '../../providers/location-tracker';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
//import { User } from '../../models/user';
import { AuthProvider } from '../../providers/auth/auth';
import { NotificationsPage } from '../notifications/notifications';
import { LoginPage } from '../login/login';


declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  latLng: any;

  @ViewChild('map') mapElement: ElementRef;
   map: any;

  //map: GoogleMap;
  public userEmail: string;
  //public userId: string;
  //user = {} as User;

  targetList: FirebaseListObservable<any[]>;

  constructor(
    private afAuth: AngularFireAuth,
    private toast: ToastController,
    public authData: AuthProvider,
    public navCtrl: NavController, afDB: AngularFireDatabase,
    private googleMaps: GoogleMaps,
    public platform: Platform,
    private geolocation: Geolocation,
    public locationTracker: LocationTrackerProvider) {
      this.afAuth.authState.subscribe(auth => {
         if(auth) {
            //let userId = auth.uid;
            this.userEmail = auth.email;
             console.log('You are authenticated', this.userEmail)
         } else {
             console.log('You are not authenticated')
         }

       });

      //  platform.ready().then(() => {
      //    this.loadMap();
      // });
       this.latLng = new google.maps.LatLng(2.9427466,101.8737259);


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
          message: 'Sorry, You are not logged in',
          duration: 3000
        }).present();
      }
    });

     this.getLocation();
  }

  loadMap(){


      let mapOptions = {
        center: this.latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);



  }

  getLocation(){

        this.geolocation.getCurrentPosition().then((resp) => {

          this.latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

       let mapOptions = {
         center: this.latLng,
         zoom: 15,
         mapTypeId: google.maps.MapTypeId.ROADMAP
       }

       this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

       let marker = new google.maps.Marker({
         map: this.map,
         animation: google.maps.Animation.DROP,
         position: this.latLng
       });

       let content = "<h4>Current Location</h4>";

       this.addInfoWindow(marker, content);



    }).catch((error) => {
      console.log('Error getting location', error);
    });


  }

  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

  start(){
    this.locationTracker.startTracking();

  }

  stop(){
    this.locationTracker.stopTracking();
  }

  // async logout(user: User){
  //   const result = this.afAuth.auth.signOut();
  // }

  notifications(params){
      if (!params) params = {};
    this.navCtrl.push(NotificationsPage);
  }

  home(params){
    if (!params) params = {};
    this.navCtrl.push(HomePage);
  }

  logoutUser(){

    this.authData.logoutUser()
    .then( authData => {
    this.navCtrl.setRoot(LoginPage);
    });
  }

}
