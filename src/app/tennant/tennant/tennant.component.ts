import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTennantComponent } from './add-tennant/add-tennant.component';
import { Tennant } from '../tennant.model';
import { UiService } from '../../shared/ui.service';
import { propertiesPath, tennantsPath } from '../../shared/paths';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-tennant',
  templateUrl: './tennant.component.html',
  styleUrls: ['./tennant.component.scss']
})
export class TennantComponent implements OnInit {
  tennants: Tennant[] = []
  loading: boolean = true;
  tennantsPath = tennantsPath;
  sub: Subscription;

  constructor(
    private dialog: MatDialog,
    private uiService: UiService,
) { }

  ngOnInit(): void {
    this.sub = this.uiService.get(tennantsPath).subscribe(
      (res: Tennant[]) => {
        this.tennants = res;
        this.loading = false;
      }
    );
  }

  onDestroy() {
    this.sub.unsubscribe();
  }

  addTennant() {
    this.dialog.open(AddTennantComponent, {
      width: '100%',
      data: {}
    });
  }

  editTennant(e: Tennant) {
    this.dialog.open(AddTennantComponent, {
      width: '100%',
      data: e
    });
  }

  deleteTennant(e: Tennant) {
    this.uiService.delete(e, tennantsPath).then(
      () => {
        this.uiService.scanObjectsForItemToDelete(e.id, 'tennants', propertiesPath);
      },
      err => {
        console.log(err);
      }
    );
  }

}
