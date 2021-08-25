import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { UiService } from '../shared/ui.service';
import { Store } from '@ngrx/store';

@Injectable()
export class HouseService {

  private userID: string = null;
  private fbSubs: Subscription[] = [];
  private propertyManagersPath = 'propertyManagers';

  constructor(
      private db: AngularFirestore,
      private uiService: UiService,
      private afAuth: AngularFireAuth,
      private store: Store<fromPropertyManager.State>
      ) {
  }

  fetchHouse() {
    this.userID = localStorage.getItem('userId');
    if (!this.userID) {
      this.uiService.showSnackbar('No User Id present, did not query Property Managers', null, 3000);
      return;
    }
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
        .collection(this.propertyManagersPath, ref => ref.where('userId', '==', this.userID))
        .snapshotChanges().pipe(
          map(docArray => {
            return docArray.map((doc: any) => {
              return {
                id: doc.payload.doc.id,
                userId: doc.payload.doc.data()['userId'],
                name: doc.payload.doc.data()['name'],
                mobile: doc.payload.doc.data()['mobile'],
                email: doc.payload.doc.data()['email'],
                address: doc.payload.doc.data()['address'],
                imageUrl: doc.payload.doc.data()['imageUrl']
              };
            });
          })
        ).subscribe({
          next: (managers: PropertyManager[]) => {
            this.store.dispatch(new UI.StopLoading());
            this.store.dispatch(new PropertyManagerActions.SetPropertyManager(managers));
          },
          error: (e) => {
            console.log(e);
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar('Fetching Managers failed, please try again later', null, 3000);
          }
      })
    )
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