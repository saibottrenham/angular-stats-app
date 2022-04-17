import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable()
export class UiService {
  userID: string;
  private days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  constructor(
      private snackBar: MatSnackBar,
      private db: AngularFirestore,
      private storage: AngularFireStorage,
      private authService: AuthService) {}

  showSnackbar(message, action, duration) {
    this.snackBar.open(message, action, {
      duration: duration
    });
  }

  getTodayWeekDay(index: number = 0) {
    const todayIndex: number = new Date().getDay();
    return index > 0 ? this.days[index] : this.days[todayIndex];
  }

  getFireStoreId() {
    return this.db.createId();
  }

  get(path: string): Observable<any> {
      const userId = this.checkIfUserLoggedIn();
      return this.db.collection(path, ref =>
            ref.where('userId', '==', userId)
          ).valueChanges({ idField: 'id' });
  }

  set(element: any, path: string) {
      return this.db.collection(path).doc(element.id).set(element);
  }

  delete(e: any, path: string) {
    const userId = this.checkIfUserLoggedIn();
    return this.db.collection(path, ref => ref.where('userId', '==', userId)).doc(e.id).delete()
  }

  scanObjectsForItemToDelete(itemId: string, attribute: string, path: string) {
    const userId = this.checkIfUserLoggedIn();
    return this.db.collection(path, ref => ref.where('userId', '==', userId)).valueChanges({ idField: 'id' })
      .subscribe(
        res => {
          res.forEach(element => {
            element[attribute].forEach(
              id => {
                if (id === itemId) {
                  element[attribute].splice(element[attribute].indexOf(id), 1);
                }
              }
            );
            this.set(element, path);
          }
        )
    });
  }
  
  deleteImageFromStorage(imageUrl: string) {
    this.checkIfUserLoggedIn();
    this.storage.refFromURL(imageUrl).delete()
  }

  checkIfUserLoggedIn() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      return userId;
    }
    this.authService.logout();
    this.authService.redirectToLogin()
    return null;
  }
}
