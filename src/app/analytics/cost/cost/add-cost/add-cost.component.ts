import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Cost } from '../../cost.model';
import { UiService } from '../../../../shared/ui.service';
import { costsPath } from '../../../../shared/paths';

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
    costsPath = costsPath
    

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Cost,
        private uiService: UiService,
        public dialogRef: MatDialogRef<AddCostComponent>,) {

    }

    ngOnInit(): void {
        this.costForm = new FormGroup({
            name: new FormControl(this.data?.name, {validators: [Validators.required]}),
            frequency: new FormControl(this.data?.frequency, { validators: [Validators.required] }),
            amount: new FormControl(this.data?.amount, { validators: [Validators.required] }),
            paymentDate: new FormControl(this.data?.paymentDate ? new Date(this.data?.paymentDate.seconds * 1000) : null, { validators: [Validators.required] })
        });
    }

    onSubmit() {
        this.uiService.set({
            ...this.costForm.value,
            imageUrl: this.imageUrl ? this.imageUrl : this.data?.imageUrl || null,
            id: this.data?.id ? this.data.id : this.uiService.getFireStoreId(),
            created: this.data?.created ? this.data.created : new Date(),
            lastUpdated: new Date(),
            userId: localStorage.getItem('userId')
        }, costsPath).then(() => {
            this.dialogRef.close();
        });

    }
}
