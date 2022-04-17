import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCostComponent } from './add-cost/add-cost.component';
import { Cost } from '../cost.model';
import { UiService } from '../../../shared/ui.service';
import { costsPath, propertiesGroupPath } from '../../../shared/paths';


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
    private uiService: UiService,
) { }

  ngOnInit(): void {
    this.subs.push(this.uiService.get(costsPath).subscribe(res => {
      this.costs = res;
      this.loading = false;
    }));
  }

  onDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  addCost() {
    this.dialog.open(AddCostComponent, {
      width: '100%',
      data: {}
    });
  }

  editCost(e: Cost) {
    this.dialog.open(AddCostComponent, {
      width: '100%',
      data: {...e}
    });
  }

  deleteCost(e: Cost) {
    this.uiService.delete(e, costsPath).then(
      () => {
        this.uiService.scanObjectsForItemToDelete(e.id, 'costs', propertiesGroupPath);
      },
      err => {
        console.log(err);
      }
    );
  }
}
