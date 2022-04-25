import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tag } from '../../tag.model';
import { UiService } from '../../../shared/ui.service';
import { tagsPath } from '../../../shared/paths';

@Component({
    selector: 'app-add-tag',
    templateUrl: 'add-tag.component.html',
    styleUrls: ['add-tag.component.scss']
})
export class AddTagComponent implements OnInit {
    tagForm: FormGroup;
    imageUrl: string = null;
    tag: Tag;
    tagsPath = tagsPath; 
    uploadProgress = 0;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Tag,
        private uiService: UiService,
        public dialogRef: MatDialogRef<AddTagComponent>,
    ) {  }

    ngOnInit(): void {
        this.tagForm = new FormGroup({
            name: new FormControl(this.data?.name, {validators: [Validators.required]}),
            type: new FormControl(this.data?.type, {validators: [Validators.required]}),
            imageUrl: new FormControl(this.data?.imageUrl),
        });
    }

    onSubmit() {
        const newTag = {
            ...this.tagForm.value,
            imageUrl: this.imageUrl ? this.imageUrl : this.data?.imageUrl || null,
            id: this.data?.id ? this.data.id : this.uiService.getFireStoreId(),
            created: this.data?.created ? this.data.created : new Date(),
            lastUpdated: new Date(),
            userId: localStorage.getItem('userId')
        };
        this.uiService.set(newTag, tagsPath).then(() => {
            this.dialogRef.close(newTag);
        });
    }
}
