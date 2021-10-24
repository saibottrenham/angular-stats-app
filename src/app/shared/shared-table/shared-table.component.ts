import { Component, Input, Output, EventEmitter } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

export interface Element {
  name: string;
  description?: string;
  amount?: string | number;
}

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
export class SharedTableComponent{
  @Input() dataSource: Element[] = [];
  @Input() columnsToDisplay: string[] = [];
  @Output() deleteEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output() editEmitter: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeEmitter: EventEmitter<Element> = new EventEmitter<Element>();
  expandedElement: Element | null;

  constructor() { }
}