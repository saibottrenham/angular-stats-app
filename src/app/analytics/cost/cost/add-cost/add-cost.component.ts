import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Cost } from '../../cost.model';
import { CostService } from '../../cost.service';

@Component({
    selector: 'app-add-cost',
    templateUrl: 'add-cost.component.html',
    styleUrls: ['add-cost.component.scss']
})
export class AddCostComponent implements OnInit {
    imageUrl: string = null;
    costForm: FormGroup;
    cost: Cost;
    costPath = 'Cost';
    uploadProgress = 0;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Cost,
        private costService: CostService,
        public dialogRef: MatDialogRef<AddCostComponent>,) {
    }

    ngOnInit(): void {
        this.costForm = new FormGroup({
            name: new FormControl(this.data?.name, {validators: [Validators.required]}),
            frequency: new FormControl(this.data?.frequency, { validators: [Validators.required] }),
            amount: new FormControl(this.data?.amount, { validators: [Validators.required] }),
            paymentDate: new FormControl(this.data?.paymentDate, { validators: [Validators.required] })
        });
    }

    onSubmit() {
        const cost = this.costForm.value;
        cost.imageUrl = this.imageUrl ? this.imageUrl : this.data?.imageUrl || null;
        // Edit Steps
        if (this.data?.id) {
            this.costService.editCost(
                {...cost, id: this.data.id, userId: this.data.userId, lastUpdated: new Date()}
            );
        } else {
            cost.created = new Date();
            cost.lastUpdated = new Date();
            this.costService.addCost(cost);
        }
    }
}