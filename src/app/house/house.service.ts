import { Injectable } from '@angular/core';
import * as UI from '../shared/ui.actions';
import * as fromUI from '../shared/ui.reducer';
import { map, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { UiService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import { House } from './house.model';
import * as fromHouse from './house.reducer';
import * as HouseActions from './house.actions';

@Injectable()
export class HouseService {

  private userId: string = null;
  private fbSubs: Subscription[] = [];
  private housePath = 'houses';

  constructor(
      private db: AngularFirestore,
      private uiService: UiService,
      private store: Store<fromHouse.State>,
      private uiStore: Store<fromUI.State>
      ) {
  }

  fetchHouses() {
    this.userId = localStorage.getItem('userId');
    if (!this.userId) {
      this.uiService.showSnackbar('No User Id present, did not query Houses', null, 3000);
      return;
    }
    this.uiStore.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
      .collection(this.housePath, ref => ref.where('userId', '==', this.userId))
      .snapshotChanges().pipe(
        map(docArray => {
          return docArray.map((doc: any) => {
            return {
              id: doc.payload.doc.id,
              userId: doc.payload.doc.data()['userId'],
              name: doc.payload.doc.data()['name'],
              address: doc.payload.doc.data()['address'],
              rooms: doc.payload.doc.data()['rooms'],
              costs: doc.payload.doc.data()['costs'],
              notes: doc.payload.doc.data()['notes'],
              imageUrl: doc.payload.doc.data()['imageUrl'],
              created:  doc.payload.doc.data()['created'],
              lastUpdated: doc.payload.doc.data()['lastUpdated'],
            }
          })
        })
      )
      .subscribe({
          next: (houses: House[]) => {
            this.uiStore.dispatch(new UI.StopLoading());
            this.store.dispatch(new HouseActions.SetHouse(houses));
          },
          error: (e) => {
            console.log(e);
            this.uiStore.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar('Fetching Houses failed, please try again later', null, 3000);
          }
      })
    )
  }
  

  addHouse(e: House) {
    e.userId = localStorage.getItem('userId');
    this.uiService.addToDB(e, this.housePath, 'Added House Successfully');
  }

  editHouse(e: House) {
    this.uiService.updateToDB(e, this.housePath, 'Edited House Successfully');
  }

  deleteHouse(e: House) {
    const newE = {...e, userId: localStorage.getItem('userId')};
    this.uiService.deleteFromDB(newE, this.housePath, 'Deleted House Successfully');
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}