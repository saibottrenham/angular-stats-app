import { Injectable } from '@angular/core';
import * as UI from '../../shared/ui.actions';
import * as fromUI from '../../shared/ui.reducer';
import { map, Observable, Subscription, switchMap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { UiService } from '../../shared/ui.service';
import { Store } from '@ngrx/store';
import { Cost } from './cost.model';
import * as fromCost from './cost.reducer';
import * as CostActions from './cost.actions';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class CostService {

  private fbSubs: Subscription[] = [];
  private costPath = 'cost';

  constructor(
      private db: AngularFirestore,
      private uiService: UiService,
      private uiStore: Store<fromUI.State>,
      private afAuth: AngularFireAuth
      ) {
  }

  fetchCosts(): Observable<Cost[]> {
    this.uiStore.dispatch(new UI.StartLoading());
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db
            .collection<Cost>(this.costPath, ref =>
              ref.where('userId', '==', user.uid)
            )
            .valueChanges({ idField: 'id' });
        } else {
          return [];
        }
      }),
    );
  }

  getCosts(costs: String[]): Observable<Cost[]>  {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db.collection<Cost>(this.costPath, ref =>
            ref.where('id', 'in', costs).where('userId', '==', user.uid)
          ).valueChanges({ idField: 'id' });
        } else {
          return [];
        }
      })
    );
  }

  createCostId(): string {
    return this.uiService.getFireStoreId();
  }

  createCost(id: string, cost: Cost) {
      return this.db.collection(this.costPath).doc(id).set(cost);
  }

  editCost(e: Cost) {
    const userId = localStorage.getItem('userId');
    if (userId) {
      return this.db.collection<Cost>(
        this.costPath, ref => ref.where('userId', '==', userId)
      ).doc(e.id).update({...e, userId: userId});
    } else {
      return null;
    }   
  }

  deleteCost(e: Cost) {
    return this.db.collection(this.costPath, ref => ref.where('userId', '==', e.userId)).doc(e.id).delete()
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}
