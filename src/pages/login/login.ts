import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
//import { User } from '../../models/user';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFireAuth } from 'angularfire2/auth';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  // user = {} as User;
  public loginForm: FormGroup;
  public loading: Loading;

  constructor(
    private afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public authData: AuthProvider,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
      this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required,
          EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6),
        Validators.required])]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goToSignUp(params){
    if (!params) params = {};
    this.navCtrl.push(RegisterPage);
  }

  goToResetPassword(){
    this.navCtrl.push('ResetPasswordPage');
  }

  loginUser(){
    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then( authData => {
        this.navCtrl.setRoot(HomePage);
      }, error => {
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: error.message,
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

  // async login(user: User){
  //   try{
  //     const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  //     //console.log(result);
  //     if(result){
  //       this.navCtrl.setRoot(HomePage);
  //     }
  //   }catch(e){
  //     console.error(e);
  //   }
  // }

}
