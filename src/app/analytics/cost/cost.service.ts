import { Injectable } from '@angular/core';
import * as UI from '../../shared/ui.actions';
import * as fromUI from '../../shared/ui.reducer';
import { map, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { UiService } from '../../shared/ui.service';
import { Store } from '@ngrx/store';
import { Cost } from './cost.model';
import * as fromCost from './cost.reducer';
import * as CostActions from './cost.actions';

@Injectable()
export class CostService {

  private userId: string = null;
  private fbSubs: Subscription[] = [];
  private costPath = 'cost';

  constructor(
      private db: AngularFirestore,
      private uiService: UiService,
      private store: Store<fromCost.State>,
      private uiStore: Store<fromUI.State>
      ) {
  }

  fetchCosts() {
    this.userId = localStorage.getItem('userId');
    if (!this.userId) {
      this.uiService.showSnackbar('No User Id present, did not query Costs', null, 3000);
      return;
    }
    this.uiStore.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
      .collection(this.costPath, ref => ref.where('userId', '==', this.userId))
      .snapshotChanges().pipe(
        map(docArray => {
          return docArray.map((doc: any) => {
            return {
              id: doc.payload.doc.id,
              userId: doc.payload.doc.data()['userId'],
              name: doc.payload.doc.data()['name'],
              frequency: doc.payload.doc.data()['frequency'],
              amount: doc.payload.doc.data()['amount'],
              receipt: doc.payload.doc.data()['receipt'],
              paymentDate: new Date(doc.payload.doc.data()['paymentDate'].seconds * 1000),
              created:  doc.payload.doc.data()['created'],
              lastUpdated: doc.payload.doc.data()['lastUpdated']
            }
          })
        })
      )
      .subscribe({
          next: (costs: Cost[]) => {
            this.uiStore.dispatch(new UI.StopLoading());
            this.store.dispatch(new CostActions.SetCost(costs));
          },
          error: (e) => {
            console.log(e);
            this.uiStore.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar('Fetching Costs failed, please try again later', null, 3000);
          }
      })
    )
  }
  

  addCost(e: Cost) {
    e.userId = localStorage.getItem('userId');
    this.uiService.addToDB(e, this.costPath, 'Added Cost Successfully');
  }

  editCost(e: Cost) {
    this.uiService.updateToDB(e, this.costPath, 'Edited Cost Successfully');
  }

  deleteCost(e: Cost) {
    const newE = {...e, userId: localStorage.getItem('userId')};
    this.uiService.deleteFromDB(newE, this.costPath, 'Deleted Cost Successfully');
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}