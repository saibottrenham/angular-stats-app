import { Injectable } from '@angular/core';
import * as UI from '../shared/ui.actions';
import * as fromUI from '../shared/ui.reducer';
import { map, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { UiService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import { Property } from './property.model';
import * as fromProperty from './property.reducer';
import * as PropertyActions from './property.actions';

@Injectable()
export class PropertyService {

  private userId: string = null;
  private fbSubs: Subscription[] = [];
  private propertyPath = 'properties';

  constructor(
      private db: AngularFirestore,
      private uiService: UiService,
      private store: Store<fromProperty.State>,
      private uiStore: Store<fromUI.State>
      ) {
  }

  fetchProperties() {
    this.userId = localStorage.getItem('userId');
    if (!this.userId) {
      this.uiService.showSnackbar('No User Id present, did not query Properties', null, 3000);
      return;
    }
    this.uiStore.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
      .collection(this.propertyPath, ref => ref.where('userId', '==', this.userId))
      .snapshotChanges().pipe(
        map(docArray => {
          return docArray.map((doc: any) => {
            return {
              id: doc.payload.doc.id,
              userId: doc.payload.doc.data()['userId'],
              name: doc.payload.doc.data()['name'],
              price: doc.payload.doc.data()['price'],
              address: doc.payload.doc.data()['address'],
              tennants: doc.payload.doc.data()['tennants'],
              rentedOut: doc.payload.doc.data()['rentedOut'],
              propertyManagers: doc.payload.doc.data()['propertyManagers'],
              notes: doc.payload.doc.data()['notes'],
              imageUrl: doc.payload.doc.data()['imageUrl'],
              created:  doc.payload.doc.data()['created'],
              lastUpdated: doc.payload.doc.data()['lastUpdated']
            }
          })
        })
      )
      .subscribe({
          next: (properties: Property[]) => {
            this.uiStore.dispatch(new UI.StopLoading());
            this.store.dispatch(new PropertyActions.SetProperty(properties));
          },
          error: (e) => {
            console.log(e);
            this.uiStore.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar('Fetching Houses failed, please try again later', null, 3000);
          }
      })
    )
  }
  

  addProperty(e: Property) {
    e.userId = localStorage.getItem('userId');
    this.uiService.addToDB(e, this.propertyPath, 'Added House Successfully');
  }

  editProperty(e: Property) {
    this.uiService.updateToDB(e, this.propertyPath, 'Edited House Successfully');
  }

  deleteProperty(e: Property) {
    const newE = {...e, userId: localStorage.getItem('userId')};
    this.uiService.deleteFromDB(newE, this.propertyPath, 'Deleted House Successfully');
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}