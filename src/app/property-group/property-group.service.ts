import { Injectable } from '@angular/core';
import * as UI from '../shared/ui.actions';
import * as fromUI from '../shared/ui.reducer';
import { AngularFirestore } from '@angular/fire/firestore';
import { UiService } from '../shared/ui.service';
import { PropertyGroup } from './property-group.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable()
export class PropertyGroupService {
  private propertyGroupPath = 'propertiesGroup';

  constructor(
      private db: AngularFirestore,
      private uiStore: Store<fromUI.State>,
      private uiService: UiService,
      private afAuth: AngularFireAuth
      ) {
  }

     fetchPropertyGroups() {
      this.uiStore.dispatch(new UI.StartLoading());
      return this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            console.log('userId: ', user.uid);
            return this.db
              .collection<PropertyGroup>(this.propertyGroupPath, ref =>
                ref.where('userId', '==', user.uid)
              )
              .valueChanges({ idField: 'id' });
          } else {
            return [];
          }
        }),
      );
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
}