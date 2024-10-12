import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection, query, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;
  userInfo: any;
  password: string = '';

  constructor(private auth : Auth, private firestore: Firestore) { }

  register(email: string, password: string) {
    this.password = password;
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    this.password = password;
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  isAuthenticated(): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
      this.auth.onAuthStateChanged(user => {
        return user ? res(true) : res(false);
      });
    });
  }

  getUser() {
    return this.auth.currentUser?.email;
  }

  getPassword() {
    return this.password;
  }
}
