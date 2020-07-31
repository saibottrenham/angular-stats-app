import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthData } from './auth-data.model';
import { UiService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';
import { PropertyManagerService } from '../property-manager/property-manager.service';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private propertyManagerService: PropertyManagerService,
    private uiService: UiService,
    private store: Store<fromRoot.State>
  ) {}


  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        localStorage.setItem('userId', user.uid);
        this.store.dispatch(new Auth.SetAuthenticated());
        this.router.navigate(['/houses']);
      } else {
        this.propertyManagerService.cancelSubscriptions();
        this.store.dispatch(new Auth.SetUnauthenticated());
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth.createUserWithEmailAndPassword(
      authData.email, authData.password
    ).then(result => {
      this.store.dispatch(new UI.StopLoading());
    }).catch(error => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar(error.message, null, 3000);
    });
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth.signInWithEmailAndPassword(
      authData.email, authData.password
    ).then(result => {
      this.store.dispatch(new UI.StopLoading());
    }).catch(error => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar(error.message, null, 3000);
    });
  }

  logout() {
    localStorage.setItem('userId', '');
    this.afAuth.auth.signOut();
  }
}
