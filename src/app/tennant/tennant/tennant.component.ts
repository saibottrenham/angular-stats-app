import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTennantComponent } from './add-tennant/add-tennant.component';
import { TennantService } from '../tennant.service';
import * as fromRoot from '../../app.reducer';
import * as fromTennant from '../tennant.reducer';
import * as fromUI from '../../shared/ui.reducer';
import { Observable } from 'rxjs';
import { Tennant } from '../tennant.model';
import { Store } from '@ngrx/store';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-tennant',
  templateUrl: './tennant.component.html',
  styleUrls: ['./tennant.component.scss']
})
export class TennantComponent implements OnInit {
  tennants$: Observable<Tennant[]> = null;
  isLoading$: Observable<boolean> = null;

  constructor(
    private dialog: MatDialog,
    private afAuth: AngularFireAuth,
    private tennantService: TennantService,
    private store: Store<fromTennant.State>,
    private uiStore: Store<fromUI.State>
) { }

  ngOnInit(): void {
    this.isLoading$ = this.uiStore.select(fromRoot.getIsLoading);
    this.tennants$ = this.store.select(fromTennant.getTennants);
    this.tennantService.fetchTennants();
  }

  addTennant() {
    const dialogRef = this.dialog.open(AddTennantComponent, {
      width: '600px',
    });
  }

  editTennant(e: Tennant) {
    this.dialog.open(AddTennantComponent, {
      width: '600px',
      data: e
    });
  }

  deleteTennant(e: Tennant) {
    this.tennantService.deleteTennant(e);
  }

}
