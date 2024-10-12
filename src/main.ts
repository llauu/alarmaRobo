import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)), provideFirebaseApp(() => initializeApp({"projectId":"ionic-app-d39f5","appId":"1:402383161721:web:4acc472429e6c0977f87a8","storageBucket":"ionic-app-d39f5.appspot.com","apiKey":"AIzaSyBbY-sZifYeAN0D86HAj6IQNO8j11iFXYc","authDomain":"ionic-app-d39f5.firebaseapp.com","messagingSenderId":"402383161721"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
  ],
});
