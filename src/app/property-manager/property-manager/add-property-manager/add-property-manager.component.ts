import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
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
        // @Inject(MAT_DIALOG_DATA) public data: any,
        private propertyManagerService: PropertyManagerService) {
    }

    ngOnInit(): void {
        this.addManager = new FormGroup({
            name: new FormControl('', {validators: [Validators.required]}),
            mobile: new FormControl('', { validators: [Validators.required] }),
            email: new FormControl('', { validators: [Validators.required] }),
            address: new FormControl('', { validators: [Validators.required] }),
            imageUrl: new FormControl(''),
        });
    }

    onUploadFinished(imageUrl: string) {
            this.imageUrl = imageUrl;
    }

    onSubmit() {
        this.manager = this.addManager.value;
        this.manager.imageUrl = this.imageUrl ? this.imageUrl : null;
        this.propertyManagerService.addPropertyManager(this.manager);
    }
}
