import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCostComponent } from './add-cost/add-cost.component';
import { CostService } from '../cost.service';
import { Cost } from '../cost.model';


@Component({
  selector: 'app-cost',
  templateUrl: './cost.component.html',
  styleUrls: ['./cost.component.scss']
})
export class CostComponent implements OnInit {
  loading = true;
  costs: Cost[];
  subs: any[] = [];

  constructor(
    private dialog: MatDialog,
    private costService: CostService,
) { }

  ngOnInit(): void {
    this.subs.push(this.costService.fetchCosts().subscribe(res => {
      this.costs = res;
      this.loading = false;
    }));
  }

  onDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  addCost() {
    this.dialog.open(AddCostComponent, {
      width: '600px',
      data: {}
    });
  }

  editCost(e: Cost) {
    this.dialog.open(AddCostComponent, {
      width: '600px',
      data: e
    });
  }

  deleteCost(e: Cost) {
    this.costService.deleteCost(e);
  }

}
