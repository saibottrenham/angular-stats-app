import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTagComponent } from './add-tag/add-tag.component';
import { Tag } from '../tag.model';
import { UiService } from '../../shared/ui.service';
import { costsPath, tagsPath } from '../../shared/paths';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  tags: Tag[] = []
  loading: boolean = true;
  tagsPath = tagsPath;
  sub: Subscription;

  constructor(
    private dialog: MatDialog,
    private uiService: UiService,
) { }

  ngOnInit(): void {
    this.sub = this.uiService.get(tagsPath).subscribe(
      (res: Tag[]) => {
        this.tags = res;
        this.loading = false;
      }
    );
  }

  onDestroy() {
    this.sub.unsubscribe();
  }

  addTag() {
    this.dialog.open(AddTagComponent, {
      width: '100%',
      data: {}
    });
  }

  editTag(e: Tag) {
    this.dialog.open(AddTagComponent, {
      width: '100%',
      data: e
    });
  }

  deleteTag(e: Tag) {
    this.uiService.delete(e, tagsPath).then(
      () => {
        this.uiService.scanObjectsForItemToDelete(e.id, 'costs', costsPath);
      },
      err => {
        console.log(err);
      }
    );
  }

}
