import { Component, OnDestroy } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonModal, IonInput, LoadingController } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Torch } from '@capawesome/capacitor-torch'; 
import { Haptics } from '@capacitor/haptics'; 
import { Motion } from '@capacitor/motion'; 
import { Howl } from 'howler';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [ FormsModule,IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonModal, IonInput],
})
export class HomePage implements OnDestroy {
  loading!: HTMLIonLoadingElement;
  pass: string = '';
  alarmaActiva = false;
  showModal = false;
  private orientacionSubscription: any;
  private ultimaOrientacion: string = '';


  alarmaUno = new Howl({ src: ['assets/sounds/alarma1.mp3'] });
  alarmaDos = new Howl({ src: ['assets/sounds/alarma2.mp3'] });

  audioIzquierda = new Howl({ src: ['assets/sounds/audio_izq.ogg'] });
  audioDerecha = new Howl({ src: ['assets/sounds/audio_der.ogg'] });
  audioHorizontal = new Howl({ src: ['assets/sounds/audio_hor.ogg'] });
  audioVertical = new Howl({ src: ['assets/sounds/audio_ver.ogg'] });
  audioError = new Howl({ src: ['assets/sounds/alarma3.mp3'] });


  constructor(public authService: AuthService, private router: Router, private loadingCtrl: LoadingController) {
    this.loadingCtrl.create()
      .then(loading => {
        this.loading = loading;
      });
  }


  cerrarSesion() {
    this.loading.present();

    this.authService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .finally(() => {
        this.loading.dismiss();
      });
  }

  activarAlarma() {
    if(this.alarmaActiva) {
      this.showModal = true;
    }
    else {
      this.alarmaActiva = true;
      this.iniciarMonitoreoOrientacion(); 
    }
  }

  verificarPass() {
    if(this.pass === this.authService.getPassword()) {
      this.showModal = false;
      this.desactivarAlarma();
    }
    else {
      this.activarAlarmaError();
    }
  }

  closeModal() {
    this.showModal = false;
  }
  
  iniciarMonitoreoOrientacion() {
    this.orientacionSubscription = Motion.addListener('orientation', (event: any) => {
      if (!this.alarmaActiva) return;

      const gamma = event.gamma;
      const beta = event.beta;
      const movimientoUmbral = 15; 

      const nuevaOrientacion = this.obtenerEstadoInclinacion(gamma, beta, movimientoUmbral);

      if (nuevaOrientacion && nuevaOrientacion !== this.ultimaOrientacion) {
        // Reproducir sonido solo si la orientación cambió
        this.reproducirSonido(nuevaOrientacion);
        this.ultimaOrientacion = nuevaOrientacion;

        if (nuevaOrientacion === 'vertical') {
          Torch.enable(); // Encender la linterna
          setTimeout(() => Torch.disable(), 5000); // Apagar después de 5 segundos
        }
      }
    });
  }

  obtenerEstadoInclinacion(gamma: number, beta: number, umbral: number): string {
    if (Math.abs(gamma) > umbral) {
      if (gamma < -45) return 'izquierda';
      else if (gamma > 45) return 'derecha';
    }
    if (Math.abs(beta) > 80) return 'vertical';
    if (Math.abs(gamma) < 5 && Math.abs(gamma) > -5  && Math.abs(beta) < 10 && Math.abs(beta) > -10) return'horizontal'
    return '';
  }

  reproducirSonido(direccion: string) {
    this.stopAllSounds();

    switch (direccion) {
      case 'izquierda':
        this.alarmaUno.play();
        this.audioIzquierda.play();
        this.vibrar();
        break;
      case 'derecha':
        this.alarmaDos.play();
        this.audioDerecha.play();
        this.vibrar();
        break;
      case 'vertical':
        this.alarmaUno.play();
        this.audioVertical.play();
        this.vibrar();
        break;
      case 'horizontal':
        this.alarmaDos.play();
        this.audioHorizontal.play();
        this.vibrar();
        break;
    }
  }

  vibrar() {
    Haptics.vibrate({ duration: 5000 });
  }

  stopAllSounds() {
    this.alarmaUno.stop();
    this.alarmaDos.stop();
    this.audioIzquierda.stop();
    this.audioDerecha.stop();
    this.audioVertical.stop();
    this.audioHorizontal.stop();
  }

  desactivarAlarma() {
    this.alarmaActiva = false;

    this.stopAllSounds(); // Detener todos los sonidos
    Torch.disable(); // Apagar la linterna
    this.ultimaOrientacion = ''; // Restablecer la última orientación
  }

  activarAlarmaError() {
    this.vibrar();
    this.audioError.play();
    Torch.enable();
    setTimeout(() => Torch.disable(), 5000);
  }

  ngOnDestroy() {
    if (this.orientacionSubscription) {
      this.orientacionSubscription.remove(); // Limpia la suscripción al destruir el componente
    }
  }
}
