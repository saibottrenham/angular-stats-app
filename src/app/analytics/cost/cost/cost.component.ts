import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCostComponent } from './add-cost/add-cost.component';
import { CostService } from '../cost.service';
import * as fromRoot from '../../../app.reducer';
import * as fromCost from '../cost.reducer';
import * as fromUI from '../../../shared/ui.reducer';
import { Observable } from 'rxjs';
import { Cost } from '../cost.model';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-cost',
  templateUrl: './cost.component.html',
  styleUrls: ['./cost.component.scss']
})
export class CostComponent implements OnInit {
  costs$: Observable<Cost[]> = null;
  isLoading$: Observable<boolean> = null;

  constructor(
    private dialog: MatDialog,
    private costService: CostService,
    private store: Store<fromCost.State>,
    private uiStore: Store<fromUI.State>
) { }

  ngOnInit(): void {
    this.isLoading$ = this.uiStore.select(fromRoot.getIsLoading);
    this.costs$ = this.store.select(fromCost.getCosts);
    this.costService.fetchCosts();
  }

  addCost() {
    const dialogRef = this.dialog.open(AddCostComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(() => this.costService.fetchCosts());
  }

  editCost(e: Cost) {
    const dialogRef = this.dialog.open(AddCostComponent, {
      width: '600px',
      data: e
    });
    dialogRef.afterClosed().subscribe(() => this.costService.fetchCosts());
  }

  deleteCost(e: Cost) {
    this.costService.deleteCost(e);
  }

}
