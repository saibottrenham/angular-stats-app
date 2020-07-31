import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import * as UI from './ui.actions';
import * as fromUI from './ui.reducer';
import { Store } from '@ngrx/store';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class UiService {
  userID: string;
  private days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  constructor(
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

  addToDB(data: any, path: string) {
    this.store.dispatch(new UI.StartLoading());
    this.db.collection(path)
        .add(data).then(() => {
      this.store.dispatch(new UI.StopLoading());
    }).catch(() => {
      this.store.dispatch(new UI.StopLoading());
      this.showSnackbar('Something Went wrong, can\'t save table', null, 3000);
    });
  }

  updateToDB(data: any, path: string, id: string = null) {
    this.store.dispatch(new UI.StartLoading());
    this.db.collection(path, ref => ref.where('userID', '==', this.userID))
        .doc(id !== null ? id : data.id).update(data).then(() => {
      this.store.dispatch(new UI.StopLoading());
    }).catch(() => {
      this.store.dispatch(new UI.StopLoading());
      this.showSnackbar('Something Went wrong, can\'t update table', null, 3000);
    });
  }
}
