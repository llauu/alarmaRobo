import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingController, IonButton, IonInput, IonItem, IonLabel, IonContent, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { FormsModule, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [RouterLink, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonLabel, IonInput, CommonModule, ReactiveFormsModule, FormsModule]
})
export class RegisterPage {
  registerForm: any;
  errorMsg: string = '';
  loading!: HTMLIonLoadingElement;

  constructor(public authService: AuthService, private router: Router, private loadingCtrl: LoadingController) {
    this.registerForm = new FormGroup ({
      email: new FormControl('', [Validators.email, Validators.required]),
      pass: new FormControl('', [Validators.required, Validators.minLength(6)]),
      repeatPass: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
    
    this.loadingCtrl.create()
      .then(loading => {
        this.loading = loading;
      });
  }

  onSubmit() {
    this.loading.present();

    if (this.registerForm.valid) {
      if(this.registerForm.value.pass === this.registerForm.value.repeatPass) {
        this.authService.register(this.registerForm.value.email, this.registerForm.value.pass)
        .then((res: any) => {
          if(res.user.email !== null) {
            this.registerForm.controls.email.setValue('');
            this.registerForm.controls.pass.setValue('');
            this.registerForm.controls.repeatPass.setValue('');
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
      else {
        this.errorMsg = 'Las contraseñas no coinciden.';
      }
    }
  }
}
