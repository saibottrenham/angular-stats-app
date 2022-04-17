import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PropertyManager } from '../../property-manager.model';
import { propertyManagersPath } from '../../../shared/paths';
import { UiService } from '../../../shared/ui.service';

@Component({
    selector: 'app-add-property-manager',
    templateUrl: 'add-property-manager.component.html',
    styleUrls: ['add-property-manager.component.scss']
})
export class AddPropertyManagerComponent implements OnInit {
    propertyManagerForm: FormGroup;
    imageUrl: string = null;
    propertyManager: PropertyManager;
    propertyManagersPath = propertyManagersPath;
    uploadProgress = 0;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: PropertyManager,
        private dialogRef: MatDialogRef<PropertyManager>,
        private uiService: UiService
    ) { }

    ngOnInit(): void {
        this.propertyManagerForm = new FormGroup({
            name: new FormControl(this.data?.name, {validators: [Validators.required]}),
            mobile: new FormControl(this.data?.mobile, { validators: [Validators.required] }),
            email: new FormControl(this.data?.email, { validators: [Validators.required] }),
            address: new FormControl(this.data?.address, { validators: [Validators.required] }),
            imageUrl: new FormControl(this.data?.imageUrl),
        });
    }

    onSubmit() {
        const newPropertyManager =  { 
            ...this.propertyManagerForm.value,
            imageUrl: this.imageUrl ? this.imageUrl : this.data?.imageUrl || null,
            id: this.data?.id ? this.data.id : this.uiService.getFireStoreId(),
            created: this.data?.created ? this.data.created : new Date(),
            lastUpdated: new Date(),
            userId: localStorage.getItem('userId')
        }
        this.uiService.set(newPropertyManager, propertyManagersPath).then(() => {
            this.dialogRef.close(newPropertyManager);
        });

    }
}
