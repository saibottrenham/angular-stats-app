import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-add-house',
    templateUrl: './add-house.component.html',
    styleUrls: ['./add-house.component.scss']
})
export class AddHouseComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    }
}
