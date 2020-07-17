import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { TrainingService } from './training.service';
import * as fromTraining from './training.reducer';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent {
  ongoingTraining$: Observable<boolean>;

  constructor(private trainingService: TrainingService, private store: Store<fromTraining.State>) {}
}
