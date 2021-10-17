import { Injectable } from '@angular/core';
import * as UI from '../shared/ui.actions';
import * as fromUI from '../shared/ui.reducer';
import { map, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { UiService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import { PropertyGroup } from './property-group.model';
import * as fromPropertyGroup from './property-group.reducer';
import * as PropertyGroupActions from './property-group.actions';

@Injectable()
export class PropertyGroupService {

  private userId: string = null;
  private fbSubs: Subscription[] = [];
  private propertyGroupPath = 'propertiesGroup';

  constructor(
      private db: AngularFirestore,
      private uiService: UiService,
      private store: Store<fromPropertyGroup.State>,
      private uiStore: Store<fromUI.State>
      ) {
  }

  fetchPropertyGroups() {
    this.userId = localStorage.getItem('userId');
    if (!this.userId) {
      this.uiService.showSnackbar('No User Id present, did not query Property Groups', null, 3000);
      return;
    }
    this.uiStore.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
      .collection(this.propertyGroupPath, ref => ref.where('userId', '==', this.userId))
      .snapshotChanges().pipe(
        map(docArray => {
          return docArray.map((doc: any) => {
            return {
              id: doc.payload.doc.id,
              userId: doc.payload.doc.data()['userId'],
              name: doc.payload.doc.data()['name'],
              costs: doc.payload.doc.data()['costs'],
              properties: doc.payload.doc.data()['properties'],
              notes: doc.payload.doc.data()['notes'],
              imageUrl: doc.payload.doc.data()['imageUrl'],
              created:  doc.payload.doc.data()['created'],
              lastUpdated: doc.payload.doc.data()['lastUpdated']
            }
          })
        })
      )
      .subscribe({
          next: (propertyGroups: PropertyGroup[]) => {
            this.uiStore.dispatch(new UI.StopLoading());
            this.store.dispatch(new PropertyGroupActions.SetPropertyGroup(propertyGroups));
          },
          error: (e) => {
            console.log(e);
            this.uiStore.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar('Fetching Property Groups failed, please try again later', null, 3000);
          }
      })
    )
  }
  

  addPropertyGroup(e: PropertyGroup) {
    e.userId = localStorage.getItem('userId');
    this.uiService.addToDB(e, this.propertyGroupPath, 'Added Property Group Successfully');
  }

  editPropertyGroup(e: PropertyGroup) {
    this.uiService.updateToDB(e, this.propertyGroupPath, 'Edited Property Group Successfully');
  }

  deletePropertyGroup(e: PropertyGroup) {
    const newE = {...e, userId: localStorage.getItem('userId')};
    this.uiService.deleteFromDB(newE, this.propertyGroupPath, 'Deleted Property Group Successfully');
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}