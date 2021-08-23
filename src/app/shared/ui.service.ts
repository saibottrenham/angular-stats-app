import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as UI from './ui.actions';
import * as fromUI from './ui.reducer';
import { Store } from '@ngrx/store';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class UiService {
  userID: string;
  private days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  constructor(
      private dialogRef: MatDialog,
      private snackBar: MatSnackBar,
      private db: AngularFirestore,
      private afAuth: AngularFireAuth,
      private store: Store<fromUI.State>) {
          this.afAuth.authState.subscribe(user => {
          if (user) {
            this.userID = user.uid;
          }
      });
  }

  showSnackbar(message, action, duration) {
    this.snackBar.open(message, action, {
      duration: duration
    });
  }

  getTodayWeekDay(index: number = 0) {
    const todayIndex: number = new Date().getDay();
    return index > 0 ? this.days[index] : this.days[todayIndex];
  }

  addToDB(data: any, path: string, snackbarMessage: string = null, closeAllDialoge: boolean = true) {
    this.store.dispatch(new UI.StartLoading());
    this.db.collection(path).add(data).then(() => {
      if (snackbarMessage) { this.showSnackbar(snackbarMessage, null, 3000); }
      if (closeAllDialoge) { this.dialogRef.closeAll(); }
    }).catch(() => {
      this.showSnackbar('Something Went wrong, can\'t save table', null, 3000);
    }).finally(() => this.store.dispatch(new UI.StopLoading()));
  }

  updateToDB(data: any, path: string, id: string = null, snackbarMessage: string = null) {
    this.store.dispatch(new UI.StartLoading());
    this.db.collection(path, ref => ref.where('userId', '==', this.userID))
        .doc(id !== null ? id : data.id).update(data).then(() => {
      this.store.dispatch(new UI.StopLoading());
        if (snackbarMessage) {
          this.showSnackbar(snackbarMessage, null, 3000);
      }
    }).catch(() => {
      this.store.dispatch(new UI.StopLoading());
      this.showSnackbar('Something Went wrong, can\'t update table', null, 3000);
    });
  }

  deleteFromDB(data: any,  path: string, snackbarMessage: string = null) {
        this.store.dispatch(new UI.StartLoading());
        this.db.collection(path, ref => ref.where('userId', '==', data.userId))
            .doc(data.id).delete().then(() => {
            this.store.dispatch(new UI.StopLoading());
            if (snackbarMessage) {
                this.showSnackbar(snackbarMessage, null, 3000);
            }
        }).catch(() => {
            this.store.dispatch(new UI.StopLoading());
            this.showSnackbar('Error, could not delete, please try again later', null, 3000);
        });
    }
}
