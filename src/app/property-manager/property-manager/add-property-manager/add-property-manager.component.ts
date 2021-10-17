import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PropertyManager } from '../../property-manager.model';
import { PropertyManagerService } from '../../property-manager.service';

@Component({
    selector: 'app-add-property-manager',
    templateUrl: 'add-property-manager.component.html',
    styleUrls: ['add-property-manager.component.scss']
})
export class AddPropertyManagerComponent implements OnInit {
    managerForm: FormGroup;
    imageUrl: string = null;
    manager: PropertyManager;
    propertyManagerPath = 'PropertyManager';
    uploadProgress = 0;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: PropertyManager,
        private propertyManagerService: PropertyManagerService) {
    }

    ngOnInit(): void {
        this.managerForm = new FormGroup({
            name: new FormControl(this.data?.name, {validators: [Validators.required]}),
            mobile: new FormControl(this.data?.mobile, { validators: [Validators.required] }),
            email: new FormControl(this.data?.email, { validators: [Validators.required] }),
            address: new FormControl(this.data?.address, { validators: [Validators.required] }),
            imageUrl: new FormControl(this.data?.imageUrl),
        });
    }

    onUploadFinished(imageUrl: string) {
            this.imageUrl = imageUrl;
    }

    onSubmit() {
        const manager = this.managerForm.value;
        manager.imageUrl = this.imageUrl ? this.imageUrl : this.data?.imageUrl || null;
        // Edit Steps
        if (this.data?.id) {
            this.propertyManagerService.editPropertyManager(
                {...manager, id: this.data.id, userId: this.data.userId}
            );
        } else {
            this.propertyManagerService.addPropertyManager(manager);
        }
    }
}
