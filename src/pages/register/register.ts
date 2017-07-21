import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../home/home';
import { EmailValidator } from '../../validators/email';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  //user = {} as User;
  targetList: FirebaseListObservable<any[]>;
  public userId: any;
  public userEmail: any;
  public device: any;
  public signupForm:FormGroup;
  public loading: Loading;

  constructor(private afAuth:AngularFireAuth,
    afDB: AngularFireDatabase,
    public navCtrl: NavController,
    public authData: AuthProvider,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navParams: NavParams) {

      this.afAuth.authState.subscribe(auth => {
         if(auth) {
            let userId = auth.uid;
            let userEmail = auth.email;
             console.log('You are authenticated', userEmail)
             this.targetList = afDB.list('/devices/')
         } else {
             console.log('You are not authenticated')
         }

       });

      this.signupForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  // async signUp(user: User){
  //   try{
  //     const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
  //     if(result){
  //       this.navCtrl.pop();
  //     }
  //   }catch(e){
  //     console.error(e);
  //   }
  //
  // }

  login(params){
    if (!params) params = {};
    this.navCtrl.pop();
  }

  signupUser(){
      if (!this.signupForm.valid){
        console.log(this.signupForm.value);
      } else {
        this.authData.registerUser(this.signupForm.value.email, this.signupForm.value.password)
        .then(() => {
          this.navCtrl.setRoot(HomePage);
        }, (error) => {
          this.loading.dismiss().then( () => {
            var errorMessage: string = error.message;
              let alert = this.alertCtrl.create({
                message: errorMessage,
                buttons: [
                  {
                    text: "Ok",
                    role: 'cancel'
                  }
                ]
              });
            alert.present();
          });
        });

        this.loading = this.loadingCtrl.create({
          dismissOnPageChange: true,
        });
        this.loading.present();
    }
  }
}
