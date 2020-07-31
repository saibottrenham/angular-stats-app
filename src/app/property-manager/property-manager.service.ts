import { Injectable } from '@angular/core';
import * as UI from '../shared/ui.actions';
import * as fromUI from '../shared/ui.reducer';
import { UiService } from '../shared/ui.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Store } from '@ngrx/store';
import * as fromPropertyManager from './property-manager.reducer';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/subscription';
import { PropertyManager } from './property-manager.model';
import * as PropertyManagerActions from './property-manager.actions';

@Injectable({
  providedIn: 'root'
})
export class PropertyManagerService {

  private userID: string = null;
  private fbSubs: Subscription[] = [];
  private propertyManagersPath = 'propertyManagers';

  constructor(
      private db: AngularFirestore,
      private uiService: UiService,
      private afAuth: AngularFireAuth,
      private store: Store<fromPropertyManager.State>,
      private uiStore: Store<fromUI.State>) {
  }

  fetchPropertyManager() {
    this.userID = localStorage.getItem('userId');
    if (!this.userID) {
      this.uiService.showSnackbar('No User Id present, did not query Property Managers', null, 3000);
      return;
    }
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
        .collection(this.propertyManagersPath, ref => ref.where('userID', '==', this.userID))
        .snapshotChanges()
        .map(docArray => {
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              userID: doc.payload.doc.data()['userID'],
              name: doc.payload.doc.data()['name'],
              mobile: doc.payload.doc.data()['mobile'],
              email: doc.payload.doc.data()['email'],
              imageUrl: doc.payload.doc.data()['imageUrl']
            };
          });
        })
        .subscribe((managers: PropertyManager[]) => {
          this.uiStore.dispatch(new UI.StopLoading());
          this.store.dispatch(new PropertyManagerActions.SetPropertyManager(managers));
        }, error => {
          console.log(error);
          this.uiStore.dispatch(new UI.StopLoading());
          this.uiService.showSnackbar('Fetching Managers failed, please try again later', null, 3000);
        }));
  }

  addPropertyManager(e: PropertyManager) {
    e.userID = localStorage.getItem('userId');
    this.uiService.addToDB(e, this.propertyManagersPath);
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}
