import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tennant } from '../../tennant.model';
import { UiService } from '../../../shared/ui.service';
import { tennantsPath } from '../../../shared/paths';

@Component({
    selector: 'app-add-property-manager',
    templateUrl: 'add-tennant.component.html',
    styleUrls: ['add-tennant.component.scss']
})
export class AddTennantComponent implements OnInit {
    tennantForm: FormGroup;
    imageUrl: string = null;
    tennant: Tennant;
    tennantsPath = tennantsPath; 
    uploadProgress = 0;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Tennant,
        private uiService: UiService,
        public dialogRef: MatDialogRef<AddTennantComponent>,
    ) {  }

    ngOnInit(): void {
        this.tennantForm = new FormGroup({
            name: new FormControl(this.data?.name, {validators: [Validators.required]}),
            mobile: new FormControl(this.data?.mobile, { validators: [Validators.required] }),
            email: new FormControl(this.data?.email, { validators: [Validators.required] }),
            address: new FormControl(this.data?.address, { validators: [Validators.required] }),
            imageUrl: new FormControl(this.data?.imageUrl),
        });
    }

    onSubmit() {
        const newTennant = {
            ...this.tennantForm.value,
            imageUrl: this.imageUrl ? this.imageUrl : this.data?.imageUrl || null,
            id: this.data?.id ? this.data.id : this.uiService.getFireStoreId(),
            created: this.data?.created ? this.data.created : new Date(),
            lastUpdated: new Date(),
            userId: localStorage.getItem('userId')
        };
        this.uiService.set(newTennant, tennantsPath).then(() => {
            this.dialogRef.close(newTennant);
        });
    }
}
