import { Injectable } from '@angular/core';
import * as UI from '../shared/ui.actions';
import * as fromUI from '../shared/ui.reducer';
import { map, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { UiService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import { Tennant } from './tennant.model';
import * as fromTennant from './tennant.reducer';
import * as TennantActions from './tennant.actions';

@Injectable()
export class TennantService {

  private userId: string = null;
  private fbSubs: Subscription[] = [];
  private tennantPath = 'tennants';

  constructor(
      private db: AngularFirestore,
      private uiService: UiService,
      private store: Store<fromTennant.State>,
      private uiStore: Store<fromUI.State>
      ) {
  }

  fetchTennants() {
    this.userId = localStorage.getItem('userId');
    if (!this.userId) {
      this.uiService.showSnackbar('No User Id present, did not query tennants', null, 3000);
      return;
    }
    this.uiStore.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
      .collection(this.tennantPath, ref => ref.where('userId', '==', this.userId))
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
            }
          })
        })
      )
      .subscribe({
          next: (tennants: Tennant[]) => {
            this.uiStore.dispatch(new UI.StopLoading());
            this.store.dispatch(new TennantActions.SetTennant(tennants));
          },
          error: (e) => {
            console.log(e);
            this.uiStore.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar('Fetching Properties failed, please try again later', null, 3000);
          }
      })
    )
  }
  

  addTennant(e: Tennant) {
    e.userId = localStorage.getItem('userId');
    this.uiService.addToDB(e, this.tennantPath, 'Added Tennant Successfully');
  }

  editTennant(e: Tennant) {
    this.uiService.updateToDB(e, this.tennantPath, 'Edited Tennant Successfully');
  }

  deleteTennant(e: Tennant) {
    const newE = {...e, userId: localStorage.getItem('userId')};
    this.uiService.deleteFromDB(newE, this.tennantPath, 'Deleted Tennant Successfully');
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}