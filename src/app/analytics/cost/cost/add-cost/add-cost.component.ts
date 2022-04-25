import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Cost } from '../../cost.model';
import { UiService } from '../../../../shared/ui.service';
import { costsPath, tagsPath } from '../../../../shared/paths';
import { addToObject, deleteFromDB, initViewGroups, removeFromObject, setFilters } from '../../../../shared/utils';
import { Observable, Subscription } from 'rxjs';
import { BaseModel } from '../../../../shared/common-model';
import { Tag } from '../../../../tag/tag.model';
import { AddTagComponent } from '../../../../tag/tag/add-tag/add-tag.component';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
    selector: 'app-add-cost',
    templateUrl: 'add-cost.component.html',
    styleUrls: ['add-cost.component.scss']
})
export class AddCostComponent implements OnInit {
    imageUrl: string = null;
    costForm: FormGroup;
    cost: Cost;
    uploadProgress = 0;
    costsPath = costsPath;
    tagsPath = tagsPath;

    tagCtrl = new FormControl();

    filteredTags: Observable<BaseModel[]>;

    tags: Tag[] = [];
    tableTags: Tag[] = [];
    allTags: Tag[] = [];

    subs: Subscription[] = [];

    addToObject = addToObject;
    removeFromObject = removeFromObject;
    AddTagComponent = AddTagComponent;

    viewGroups: any = {
        tags: {
            path: tagsPath,
            elements: 'tags',
            tableElements: 'tableTags',
            allElements: 'allTags',
            filteredElements: 'filteredTags',
            ctrl: 'tagCtrl',
            columns: ['name', 'type', 'removeable', 'actions'],
        }
    }

  @ViewChild('tagTrigger') tagTrigger: MatAutocompleteTrigger;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Cost,
        private dialog: MatDialog,
        private uiService: UiService,
        public dialogRef: MatDialogRef<AddCostComponent>) {
            setFilters(this);
            initViewGroups(this);
    }

    ngOnInit(): void {
        this.costForm = new FormGroup({
            name: new FormControl(this.data?.name, {validators: [Validators.required]}),
            frequency: new FormControl(this.data?.frequency, { validators: [Validators.required] }),
            amount: new FormControl(this.data?.amount, { validators: [Validators.required] }),
            paymentDate: new FormControl(this.data?.paymentDate ? new Date(this.data?.paymentDate.seconds * 1000) : null, { validators: [Validators.required] })
        });
    }

    onDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
      }

    onSubmit() {
        const newCost = {
            ...this.costForm.value,
            imageUrl: this.imageUrl ? this.imageUrl : this.data?.imageUrl || null,
            id: this.data?.id ? this.data.id : this.uiService.getFireStoreId(),
            tags: this.data?.tags?.length ? this.data.tags : [],
            created: this.data?.created ? this.data.created : new Date(),
            lastUpdated: new Date(),
            userId: localStorage.getItem('userId')
        }
        this.uiService.set(newCost, costsPath).then(() => {
            this.dialogRef.close(newCost);
        });
    }

    edit(element: any, component: any): void {
        this.dialog.open(component, {
          width: '100%',
          data: {...element}
        });
      }
    
      add(component: any, group: any): void {
        const dialogref = this.dialog.open(component, {
            width: '100%',
            data: {}
          });
        dialogref.afterClosed().subscribe(element => {
          if (element) this.addToObject(
              this, element, group.elements, group.tableElements, group.allElements, group.ctrl, costsPath
            );
        });
      }
    
      remove(item: any, path: string, group: any): void {
        deleteFromDB(this, item, group.elements, group.tableElements, path);
      }
}
