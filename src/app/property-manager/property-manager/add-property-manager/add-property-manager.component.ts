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
    addManager: FormGroup;
    imageUrl: string;
    manager: PropertyManager;
    propertyManagerPath = 'PropertyManager';

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: PropertyManager,
        private propertyManagerService: PropertyManagerService) {
    }

    ngOnInit(): void {
        this.addManager = new FormGroup({
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
        this.manager = this.addManager.value;
        this.manager.imageUrl = this.imageUrl ? this.imageUrl : null;
        if (this.data.id) {
            this.propertyManagerService.editPropertyManager(this.manager);
        } else {
            this.propertyManagerService.addPropertyManager(this.manager);
        }
    }
}
