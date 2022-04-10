import { Injectable } from '@angular/core';
import * as UI from '../shared/ui.actions';
import * as fromUI from '../shared/ui.reducer';
import { Observable, Subscription, switchMap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { UiService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import { Property } from './property.model';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class PropertyService {

  private fbSubs: Subscription[] = [];
  private propertyPath = 'properties';

  constructor(
      private db: AngularFirestore,
      private uiService: UiService,
      private uiStore: Store<fromUI.State>,
      private afAuth: AngularFireAuth
      ) {
  }

  fetchProperties() {
    this.uiStore.dispatch(new UI.StartLoading());
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db
            .collection<Property>(this.propertyPath, ref =>
              ref.where('userId', '==', user.uid)
            )
            .valueChanges({ idField: 'id' });
        } else {
          return [];
        }
      }),
    );
  }

  getProperties(properties: String[]): Observable<Property[]>  {
    return this.db.collection<Property>(this.propertyPath, ref =>
      ref.where('id', 'in', properties).where('userId', '==', localStorage.getItem('userId'))
    ).valueChanges({ idField: 'id' });
  }

  addProperty(e: Property) {
    e.userId = localStorage.getItem('userId');
    this.uiService.addToDB(e, this.propertyPath, 'Added Property Successfully');
  }

  editProperty(e: Property) {
    this.uiService.updateToDB(e, this.propertyPath, 'Edited Property Successfully');
  }

  deleteProperty(e: Property) {
    const newE = {...e, userId: localStorage.getItem('userId')};
    this.uiService.deleteFromDB(newE, this.propertyPath, 'Deleted Property Successfully');
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}