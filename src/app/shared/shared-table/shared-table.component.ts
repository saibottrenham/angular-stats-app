import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { BaseModel } from '../common-model';

@Component({
  selector: 'app-shared-table',
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss'],
    animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SharedTableComponent implements OnChanges {
  @Input() dataSource: BaseModel[] = [];
  @Input() title: string = '';
  @Input() columnsToDisplay: string[] = [];
  @Output() deleteEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output() editEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeEmitter: EventEmitter<BaseModel> = new EventEmitter<BaseModel>();
  expandedElement: Element | null;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataSource) {
      this.dataSource = changes.dataSource.currentValue;
    }
  }

}