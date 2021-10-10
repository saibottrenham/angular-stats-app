import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tennant } from '../../tennant.model';
import { TennantService } from '../../tennant.service';

@Component({
    selector: 'app-add-property-manager',
    templateUrl: 'add-tennant.component.html',
    styleUrls: ['add-tennant.component.scss']
})
export class AddTennantComponent implements OnInit {
    tennantForm: FormGroup;
    imageUrl: string;
    tennant: Tennant;
    tennantPath = 'Tennant';

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Tennant,
        private tennantService: TennantService) {
    }

    ngOnInit(): void {
        this.tennantForm = new FormGroup({
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
        const tennant = this.tennantForm.value;
        tennant.imageUrl = this.imageUrl ? this.imageUrl : this.data?.imageUrl || null;
        // Edit Steps
        if (this.data?.id) {
            this.tennantService.editTennant(
                {...tennant, id: this.data.id, userId: this.data.userId, lastUpdated: new Date()}
            );
        } else {
            tennant.created = new Date();
            tennant.lastUpdated = new Date();
            this.tennantService.addTennant(tennant);
        }
    }
}
