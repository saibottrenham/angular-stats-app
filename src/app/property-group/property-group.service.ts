import { Injectable } from '@angular/core';
import * as UI from '../shared/ui.actions';
import * as fromUI from '../shared/ui.reducer';
import { AngularFirestore } from '@angular/fire/firestore';
import { UiService } from '../shared/ui.service';
import { PropertyGroup } from './property-group.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { propertyGroupPath } from '../shared/paths';

@Injectable()
export class PropertyGroupService {

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
            return this.db
              .collection<PropertyGroup>(propertyGroupPath, ref =>
                ref.where('userId', '==', user.uid)
              ).valueChanges({ idField: 'id' });
          } else {
            return [];
          }
        }),
      );
    }

    getPropertyGroup(id: string) {
      return this.db.doc<PropertyGroup>(propertyGroupPath + '/' + id).valueChanges();
    }

  createPropertyGroup() {
    const initialData = {created: new Date(), lastUpdated: new Date(), userId: localStorage.getItem('userId')}
    return this.db.collection(propertyGroupPath).add(initialData);
  }

  editPropertyGroup(e: PropertyGroup) : Promise<void> {
    return this.db.collection<PropertyGroup>(propertyGroupPath, ref => ref.where('userId', '==', e.userId)).doc(e.id).update(e);
  }

  deletePropertyGroup(e: PropertyGroup) {
    const newE = {...e, userId: localStorage.getItem('userId')};
    this.uiService.deleteFromDB(newE, propertyGroupPath, 'Deleted Property Group Successfully');
  }
}