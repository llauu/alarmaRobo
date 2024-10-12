import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingController , IonButton, IonInput, IonItem, IonLabel, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonFooter } from '@ionic/angular/standalone';
import { FormsModule, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonLabel, IonInput, IonGrid, IonRow, IonCol, IonFooter, CommonModule, ReactiveFormsModule, FormsModule]
})
export class LoginPage {
  loginForm: any;
  errorMsg: string = '';
  loading!: HTMLIonLoadingElement;

  constructor(public authService: AuthService, private router: Router, private loadingCtrl: LoadingController) {
    this.loginForm = new FormGroup ({
      email: new FormControl('', [Validators.email, Validators.required]),
      pass: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    
    this.loadingCtrl.create()
      .then(loading => {
        this.loading = loading;
      });
  }

  onSubmit() {
    this.loading.present();

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.pass)
        .then((res: any) => {
          if(res.user.email !== null) {
            this.loginForm.controls.email.setValue('');
            this.loginForm.controls.pass.setValue('');
            this.errorMsg = '';
            this.router.navigate(['/home']);
          }
        })
        .catch(err => {
          switch(err.code) {
            case 'auth/invalid-email': 
              this.errorMsg = 'El correo electronico no es valido.';
              break;
  
            case 'auth/missing-password': 
              this.errorMsg = 'La contraseña no es valida.';
              break;
              
            case 'auth/invalid-credential': 
              this.errorMsg = 'El correo electronico o contraseña son incorrectos.';
              break;
          }
        })
        .finally(() => {
          this.loading.dismiss();
        });
    }
  }

  onRegister() {
    this.loginForm.controls.email.setValue('');
    this.loginForm.controls.pass.setValue('');
    this.router.navigate(['/register']);
  }

  fillForm(email: string, pass: string) {
    this.loginForm.controls.email.setValue(email);
    this.loginForm.controls.pass.setValue(pass); 
  }

  // async showLoading() {
  //   const loading = await this.loadingCtrl.create();

  //   loading.present();
  // }
}
