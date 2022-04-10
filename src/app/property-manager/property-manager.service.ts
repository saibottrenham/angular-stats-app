import { Injectable } from '@angular/core';
import * as UI from '../shared/ui.actions';
import * as fromUI from '../shared/ui.reducer';
import { UiService } from '../shared/ui.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subscription, switchMap } from 'rxjs';
import { PropertyManager } from './property-manager.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyManagerService {

  private fbSubs: Subscription[] = [];
  private propertyManagersPath = 'propertyManagers';

  constructor(
      private db: AngularFirestore,
      private uiService: UiService,
      private afAuth: AngularFireAuth,
      private uiStore: Store<fromUI.State>) {
  }

  fetchPropertyManagers() {
    this.uiStore.dispatch(new UI.StartLoading());
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db
            .collection<PropertyManager>(this.propertyManagersPath, ref =>
              ref.where('userId', '==', user.uid)
            )
            .valueChanges({ idField: 'id' });
        } else {
          return [];
        }
      }),
    );
  }

  addPropertyManager(e: PropertyManager) {
    e.userId = localStorage.getItem('userId');
    this.uiService.addToDB(e, this.propertyManagersPath, 'Added Property Manager Successfully');
  }

  editPropertyManager(e: PropertyManager) {
    this.uiService.updateToDB(e, this.propertyManagersPath, 'Edited Property Manager Successfully');
  }

  deletePropertyManager(e: PropertyManager) {
    const newE = {...e, userId: localStorage.getItem('userId')};
    this.uiService.deleteFromDB(newE, this.propertyManagersPath, 'Deleted Property Manager Successfully');
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}
